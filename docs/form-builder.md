# FormBuilder API Guide

## Overview & Data Flow

**pd-form-core** is a headless form builder and schema library used by PDPlus and PDClinic. It allows you to describe forms in a strictly typed way and export them as JSON descriptors. A descriptor includes the schema version, field definitions, layout sections and rules. At runtime the viewer store holds data and validation state, while the editor store holds selection and allows interactive editing.

### Data Flow

1. You start with a schema. The library provides `defaultSchema`, which registers several field classes (e.g., `Std.TextInput`, `Std.ScoreField`) and calculables (`Condition`, `Summation`). You can also create your own schema.
2. You instantiate a builder with `new FormBuilder(schema)`. This runs the schema in **programmatic mode**, so that no Redux side effects occur during form construction.
3. Through the builder you insert fields and optionally add rules. Each insertion returns a handle used to mutate parameters or attach rules.
4. When the form is complete, call `builder.descriptor()` to obtain an immutable `FormDescriptor` object. This object can be persisted to JSON and deployed to PDPlus or PDClinic.
5. At runtime, the viewer store (created via `schema.createViewerStore(initialData)`) binds the descriptor to actual field values and validation state. The editor store (created via `builder.schema.createEditorStore()`) drives UI editing.

## Constructor

To build a form, create a builder from a schema. The package exports both `FormBuilder` and a ready‑made `defaultSchema`:

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);
```

If you need a custom schema, see the [Extending the Schema](#extending-the-schema) section below. Internally, the builder calls `schema.programmatic()` so that building does not trigger reducers. This means any param reducers you call will return the handle for chaining but not update a Redux store.

## Public Methods

| Method | Signature | Purpose |
|-------|-----------|---------|
| `insertField(fieldClass: F, id?: string)` | Returns a `FieldHandle<F>` | Inserts a field into section 0. The optional `id` allows you to control the generated field identifier. |
| `insertFooter(fieldClass: F, id?: string)` | Returns a `FieldHandle<F>` | Inserts a field into the footer. The footer is separate from sections and appears at the bottom of the form. |
| `descriptor()` | Returns a `FormDescriptor` | Takes a snapshot of the current state of the builder and returns an immutable object ready for serialization. |

## FieldHandle Reference

Every call to `insertField` or `insertFooter` returns a handle specific to that field. The handle exposes identifiers, param mutators, rule helpers and removal.

### Identifiers

| Property | Description |
|---------|-------------|
| `fieldId` | The unique string used to identify this field within the descriptor. |

### Param Chain

`handle.param` mirrors every param reducer declared for the field class. Each call updates the params and returns the same handle for chaining.

Example:

```ts
const text = builder.insertField('Std.TextInput')
  .param.setLabel('Name')
  .param.setPlaceholder('First and Last');
// chain continues...
```

### Param Helpers

| Method | Description |
|-------|-------------|
| `setParams(params)` | Replaces the entire params object with the provided value. |
| `mergeParams(partial)` | Deep merges the provided partial into the existing params. Arrays are concatenated. |

### Rule Helpers

Rules link calculable classes to overridable parameter paths (such as `hidden` or `params.placeholder`).

| Method | Description |
|-------|-------------|
| `addRule(relPath, calculableClass)` | Attaches a calculable to the overridable path. Throws if the calculable’s return type is incompatible. Returns a `RuleHandle` that exposes param reducers for the calculable’s params. |
| `remove()` | Deletes the field and any associated rules from the builder. |

To change a field’s class after insertion, remove it and insert a new one. Changing a class resets params and removes rules.

## RuleHandle Reference

A rule handle is returned from `addRule`. Its interface mirrors the param reducers defined on the calculable class. For example, the `Condition` calculable defines reducers such as `addConditionGroup`, `setCompareField`, `setOperator`, etc. Calls on a rule handle are chainable.

Example:

```ts
const rule = comments.addRule('hidden', 'Condition');
rule.setCompareField(0, 0, age.fieldId);
rule.setOperator(0, 0, 'is-empty');
rule.setInsideLogic(0, 'and');
rule.setOutsideLogic(0, 'and');
```

## Validation Helpers

When the form is rendered and values are bound to field IDs, you can call:

| Function | Description |
|--------|-------------|
| `validateForm(data, descriptor, schema)` | Validates all fields in the form. Returns an object mapping field IDs to error strings. Hidden fields are skipped. |
| `validateField(fieldId, value, descriptor, schema)` | Validates a single value. Returns `undefined` when there is no error. |

These helpers ensure that field values satisfy the `onValidate` functions defined in each field class’s meta.

## Extending the Schema

You can register your own field classes and calculable classes by creating a new `FormSchema` instance. Here is an example that adds a simple `GyroTremor` field:

```ts
import FormSchema from 'pd-form-core/schema/FormSchema';
import { FormBuilder } from 'pd-form-core';

// Define a new schema with a custom field
const mySchema = new FormSchema({
  version: '1.0.1',
  fieldDescriptor: (b) =>
    b.append('GyroTremor', {
      initialParams: {
        label: '',
        threshold: 4.0,
      },
      initialValue: undefined,
      paramReducers: {
        setLabel: (p, label: string) => { p.label = label; },
        setThreshold: (p, thr: number) => { p.threshold = thr; },
      },
      meta: {
        getLabel: (p) => p.label,
      },
    }),
});

// Build a form using the custom schema
const builder = new FormBuilder(mySchema);
const tremor = builder.insertField('GyroTremor')
  .param.setLabel('Tremor Score')
  .param.setThreshold(5);

const descriptor = builder.descriptor();
```

You can also append calculable classes via `t.calculable(name, { type, initialParams, calculate, paramReducers })`. The `type` defines the return type (`string`, `number` or `boolean`) and must match the overridable target’s type.

## Generics Cheat‑sheet

The library exposes many TypeScript helpers to extract types from schemas. These are especially useful when building custom UIs.

| Helper | Description |
|------|-------------|
| `ExtractFieldClass<S>` | All legal `fieldClass` keys registered in schema `S`. |
| `ExtractParam<S, F>` | The param type for field class `F`. |
| `ExtractCalculableClass<S>` | All calculable class names in schema `S`. |
| `ExtractDeepReducer<S, F>` | The deep structure of param reducers for field class `F`. |

You can import these types from `pd-form-core/schema/types`.

## Full Runnable Example

The following script builds a simple form, adds a rule, exports the descriptor and writes it to a JSON file. Run it with `node` or `ts-node` once `pd-form-core` is installed:

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';
import { writeFileSync } from 'fs';

const builder = new FormBuilder(defaultSchema);

// Insert a numeric field
const ageField = builder.insertField('Std.ScoreField')
  .param.setLabel('Age')
  .param.addChoice({ value: 18, label: '18' })
  .param.addChoice({ value: 65, label: '65' });

// Insert a comments field
const comments = builder.insertField('Std.TextInput')
  .param.setLabel('Comments')
  .param.setPlaceholder('Additional notes');

// Hide comments when age is empty
const rule = comments.addRule('hidden', 'Condition');
rule.setCompareField(0, 0, ageField.fieldId);
rule.setOperator(0, 0, 'is-empty');

const descriptor = builder.descriptor();

writeFileSync('output-form.json', JSON.stringify(descriptor, null, 2));
console.log('Descriptor saved to output-form.json');
```

## FAQ / Edge Cases

**Why does `addRule` return a handle instead of adding the rule directly?**  
Rules need parameters. Returning a handle lets you immediately call param reducers on the calculable class. This pattern aligns with the `param` chain on field handles.

**How do I remove a rule?**  
Call `handle.remove()` on the field; this removes the field and all attached rules. There is no separate `removeRule` on a rule handle to avoid leaving orphan rules.

**How do I integrate with React?**  
Use the descriptor produced by the builder and the viewer store created from your schema:

```ts
const store = defaultSchema.createViewerStore();
store.dispatch({
  type: '@form/viewer/setFieldValue',
  payload: { fieldId, value: 'some value' },
});
```

You can then connect React components to the Redux store. The library also exports a `createViewerApi` helper for each field.

**Does it work in Deno?**  
Yes. Import from npm with the proper specifier:

```ts
import { FormBuilder, defaultSchema } from 'npm:pd-form-core@^1';
```

All Node‑specific imports are isolated; the package is ESM‑first with fallback CJS.

**What happens if I change a field’s class?**  
Changing a field’s class resets its params and removes any rules attached to it. If you are building programmatically, insert a new field and remove the old one instead of switching classes.

For more detailed type definitions, explore the library in your IDE or see the generated TypeDoc documentation.

## Component Reference

Looking for exhaustive documentation on each component?  The following pages describe every field and calculable class registered in the default schema, including their parameters, reducers and examples:

- [Display field](components/display.md)
- [Markdown field](components/markdown.md)
- [Std.TextInput field](components/std-text-input.md)
- [Std.ScoreField](components/std-score-field.md)
- [Std.Checkbox field](components/std-checkbox.md)
- [Condition calculable](calculables/condition.md)
- [Summation calculable](calculables/summation.md)

