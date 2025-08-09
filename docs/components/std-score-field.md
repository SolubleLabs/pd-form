# Std.ScoreField

The **Std.ScoreField** is a multiple‑choice input used for ratings or scores. It wraps a base `ScoreField` with standard metadata (label, description, required, etc.). Each choice has a value (number or string) and optional labels.

## Initial Parameters

Parameters are divided between the wrapper and the underlying `fieldProps`:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldProps.choiceLayout` | `'horizontal'` • `'vertical'` | `'horizontal'` | How the choices are laid out. |
| `fieldProps.choices` | `ScoreFieldChoice[]` | `[]` | List of available choices. Each choice has `value`, optional `label` and `additionalLabel`. |
| `fieldProps.showOther` | boolean | `false` | Whether to allow an “Other” choice for free‑form input. |
| `fieldProps.placeholder` | string • undefined | `undefined` | Placeholder for the “Other” choice. |
| `required` | boolean | `false` | When true, at least one choice must be selected. |
| `label` | string | `""` | The field label. |
| `description` | string | `""` | Additional description text. |
| `tooltips` | string | `""` | Tooltip text. |
| `layout` | `'horizontal'` • `'vertical'` | `'horizontal'` | Layout of label and field. |
| `requiredErrorMessage` | string | `"\"{name}\" is a required field"` | Template for required error. |

## Param Reducers

The following reducers are available under `param`:

| Reducer | Signature | Description |
|---------|-----------|-------------|
| `setLabel(label)` | `(label: string) => void` | Sets the field label. |
| `setdescription(description)` | `(description: string) => void` | Sets a longer description. |
| `setTooltips(tooltips)` | `(tooltips: string) => void` | Sets tooltip text. |
| `setLayout(layout)` | `(layout: 'horizontal' | 'vertical') => void` | Sets the wrapper layout. |
| `setRequired(required)` | `(required: boolean) => void` | Marks the field as required. |
| `setRequiredErrorMessage(message)` | `(message: string) => void` | Customizes the required error message. |
| `fieldProps.setChoiceLayout(layout)` | `(layout: 'horizontal' | 'vertical') => void` | Sets how choices are laid out. |
| `fieldProps.addChoice(choice?)` | `(choice?: ScoreFieldChoice) => void` | Appends a choice. If no argument is provided, an empty choice is added. |
| `fieldProps.removeChoice(index)` | `(index: number) => void` | Removes the choice at the specified index. |
| `fieldProps.setChoice(index, partial)` | `(index: number, partial: Partial<ScoreFieldChoice>) => void` | Updates an existing choice. You can set `value`, `label` or `additionalLabel`. |
| `fieldProps.clearEmpty()` | `() => void` | Removes choices whose value is empty or undefined. |

You can also call `setParams(params)` or `mergeParams(partial)` on the field handle.

## Overridable Paths

The standard wrapper exposes `required` as an overridable boolean. The base field also exposes any overridable paths defined in its `overridable` property.

## Example

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

// Create a severity rating field
const severity = builder.insertField('Std.ScoreField')
  .param.setLabel('Severity')
  .param.fieldProps.setChoiceLayout('vertical')
  .param.fieldProps.addChoice({ value: 0, label: 'None' })
  .param.fieldProps.addChoice({ value: 1, label: 'Mild' })
  .param.fieldProps.addChoice({ value: 2, label: 'Moderate' })
  .param.fieldProps.addChoice({ value: 3, label: 'Severe' })
  .param.setRequired(true);

// A comments field that becomes required when severity is Severe (value === 3)
const comments = builder.insertField('Std.TextInput')
  .param.setLabel('Comments');

const rule = comments.addRule('required', 'Condition');
rule.setCompareField(0, 0, severity.fieldId);
rule.setOperator(0, 0, '==');
rule.setCompareValue(0, 0, 3);

const descriptor = builder.descriptor();
```

In this example the Comments field is marked as required only when the user selects the “Severe” rating.
