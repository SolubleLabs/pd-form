# Display Field

The **Display** field presents static information to the user. It is useful for headings, instructions or read‑only values within your form.

## Initial Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title`   | string • number | `""` | The heading text displayed above the content. |
| `text`    | string • number | `""` | The body text displayed below the title. |

## Param Reducers

You can update these params through the `param` chain on the field handle:

| Reducer | Signature | Description |
|---------|-----------|-------------|
| `setTitle(title)` | `(title: string) => void` | Sets the field's title. |
| `setText(text)` | `(text: string | number) => void` | Sets the field's body text. |

## Overridable Paths

The Display field exposes two overridable param paths:

| Path | Type | Description |
|------|------|-------------|
| `title` | string • number | The title text. |
| `text` | string • number | The body text. |

You can attach a calculable (for example `Summation`) to these paths to compute their values dynamically.

## Example

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

// Heading for a section
const heading = builder.insertField('Display')
  .param.setTitle('Section 1')
  .param.setText('Please answer the following questions:');

// Numeric fields to sum
const a = builder.insertField('Std.ScoreField')
  .param.setLabel('A')
  .param.fieldProps.addChoice({ value: 1, label: '1' });
const b = builder.insertField('Std.ScoreField')
  .param.setLabel('B')
  .param.fieldProps.addChoice({ value: 2, label: '2' });

// Display the total of A and B
const total = builder.insertField('Display')
  .param.setTitle('Total')
  .param.setText('0');

// Attach summation rule to update the text with the sum of all numeric fields
total.addRule('text', 'Summation');

const descriptor = builder.descriptor();
```
