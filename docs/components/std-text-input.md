# Std.TextInput Field

The **Std.TextInput** field is a single‑line text entry component wrapped with standard metadata and validation. It combines a base text input with common properties such as `label`, `description`, `required` and layout control.

## Initial Parameters

The wrapper nests the base field parameters under `fieldProps` and adds its own metadata:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldProps.placeholder` | string | `""` | Placeholder text displayed when the input is empty. |
| `fieldProps.keyboardType` | [KeyboardTypeOptions](/schema/fields/types.ts) • undefined | `undefined` | Keyboard hint for mobile platforms (e.g. `'email-address'`, `'number-pad'`). |
| `required` | boolean | `false` | When true, the field must be filled. |
| `label` | string | `""` | Label shown above the input. |
| `description` | string | `""` | Additional explanatory text. |
| `tooltips` | string | `""` | Tooltip text displayed near the label. |
| `layout` | `'horizontal'` • `'vertical'` | `'horizontal'` | Arrangement of the label and input. |
| `requiredErrorMessage` | string | `"\"{name}\" is a required field"` | Template for the required error. `{name}` will be replaced with the field label. |

## Param Reducers

The field handle exposes a chain of reducers through the `param` property:

| Reducer | Signature | Description |
|---------|-----------|-------------|
| `setLabel(label)` | `(label: string) => void` | Sets the label of the field. |
| `setdescription(description)` | `(description: string) => void` | Sets the descriptive text. |
| `setTooltips(tooltips)` | `(tooltips: string) => void` | Sets tooltip text. |
| `setLayout(layout)` | `(layout: 'horizontal' | 'vertical') => void` | Sets the layout of label and field. |
| `setRequired(required)` | `(required: boolean) => void` | Marks the field as required. |
| `setRequiredErrorMessage(message)` | `(message: string) => void` | Customizes the required error template. |
| `fieldProps.setPlaceholder(placeholder)` | `(placeholder: string) => void` | Sets the placeholder text. |
| `fieldProps.setKeyboardType(type)` | `(type: KeyboardTypeOptions | undefined) => void` | Sets the keyboard type. |

In addition you can call `setParams(params)` to replace all params or `mergeParams(partial)` to deep merge partial values.

## Overridable Paths

The wrapper exposes a `required` property that may be controlled by a rule. This allows dynamic validation logic, for example making a field required based on another field's value. Any overridable keys defined on the base field become `fieldProps.<key>`.

## Example

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

// Create a text input field for a patient's name
const name = builder.insertField('Std.TextInput')
  .param.setLabel('Name')
  .param.setPlaceholder('Enter full name')
  .param.setRequired(true)
  .param.setRequiredErrorMessage('Name is required');

// Only require the name if the patient has provided an ID number
const idField = builder.insertField('Std.TextInput')
  .param.setLabel('Patient ID');
const rule = name.addRule('required', 'Condition');
rule.setCompareField(0, 0, idField.fieldId);
rule.setOperator(0, 0, '!=');
rule.setCompareValue(0, 0, '');

const descriptor = builder.descriptor();
```

In this example, the Name field becomes required only when the Patient ID is not empty.
