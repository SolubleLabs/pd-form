# Std.Checkbox Field

The **Std.Checkbox** field allows users to select multiple options from a list. It wraps a base `Checkbox` field, adding standard metadata and validation.

## Initial Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldProps.choices` | `GenericChoice[]` | `[]` | List of available choices. Each choice has a `value` and optional `label` and `images`. |
| `fieldProps.maxOthers` | number | `0` | Maximum number of “Other” entries that can be created by the user. |
| `required` | boolean | `false` | When true, the user must select at least one option. |
| `label` | string | `""` | Field label. |
| `description` | string | `""` | Additional description text. |
| `tooltips` | string | `""` | Tooltip text. |
| `layout` | `'horizontal'` • `'vertical'` | `'horizontal'` | Layout of the label and field. |
| `requiredErrorMessage` | string | `"\"{name}\" is a required field"` | Error message template when required but no options selected. |

## Param Reducers

The base `Checkbox` field does not define its own param reducers. Use the standard reducers provided by the wrapper:

| Reducer | Signature | Description |
|---------|-----------|-------------|
| `setLabel(label)` | `(label: string) => void` | Sets the label text. |
| `setdescription(description)` | `(description: string) => void` | Sets descriptive text. |
| `setTooltips(tooltips)` | `(tooltips: string) => void` | Sets tooltips. |
| `setLayout(layout)` | `(layout: 'horizontal' | 'vertical') => void` | Sets layout of label and field. |
| `setRequired(required)` | `(required: boolean) => void` | Marks the field as required. |
| `setRequiredErrorMessage(message)` | `(message: string) => void` | Customizes the required error. |

To populate the list of choices, you can call `setParams` or `mergeParams` with `fieldProps.choices`:

```ts
// Merge in choices and maxOthers
fieldHandle.mergeParams({
  fieldProps: {
    choices: [ { value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' } ],
    maxOthers: 1,
  },
});
```

Alternatively, you can construct the params entirely via `setParams`:

```ts
fieldHandle.setParams({
  fieldProps: {
    choices: [ { value: 'x' }, { value: 'y' } ],
    maxOthers: 2,
  },
  required: true,
  label: 'Select items',
});
```

## Overridable Paths

The standard wrapper exposes the `required` boolean as overridable. You can attach a calculable (e.g. `Condition`) to make the field required only under certain conditions.

## Example

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

// Checkbox for selecting symptoms
const symptoms = builder.insertField('Std.Checkbox')
  .param.setLabel('Symptoms');

symptoms.mergeParams({
  fieldProps: {
    choices: [
      { value: 'tremor', label: 'Tremor' },
      { value: 'rigidity', label: 'Rigidity' },
      { value: 'bradykinesia', label: 'Bradykinesia' },
    ],
    maxOthers: 1,
  },
});

// Make symptoms required when severity is moderate or above
const severity = builder.insertField('Std.ScoreField')
  .param.setLabel('Severity')
  .param.fieldProps.addChoice({ value: 0, label: 'None' })
  .param.fieldProps.addChoice({ value: 1, label: 'Mild' })
  .param.fieldProps.addChoice({ value: 2, label: 'Moderate' })
  .param.fieldProps.addChoice({ value: 3, label: 'Severe' });

const rule = symptoms.addRule('required', 'Condition');
rule.setCompareField(0, 0, severity.fieldId);
rule.setOperator(0, 0, '!=');
rule.setCompareValue(0, 0, 0);

const descriptor = builder.descriptor();
```

In this example the Symptoms field becomes required only when the selected severity is non‑zero.
