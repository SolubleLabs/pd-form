# Summation Calculable

The **Summation** calculable computes the sum of all numeric fields in the form. It can be attached to any overridable path of type `number` or convertible string (e.g. the `text` of a `Display` field). Hidden fields are ignored and values that cannot be parsed as numbers are skipped.

## Type

Returns: **number**

## Initial Parameters

`Summation` has no parameters. Its `initialParams` is an empty object and it defines no param reducers.

## Usage Example

Display the total of two numeric fields:

```ts
import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

const a = builder.insertField('Std.ScoreField')
  .param.setLabel('Value A')
  .param.fieldProps.addChoice({ value: 1, label: '1' })
  .param.fieldProps.addChoice({ value: 2, label: '2' });

const b = builder.insertField('Std.ScoreField')
  .param.setLabel('Value B')
  .param.fieldProps.addChoice({ value: 3, label: '3' })
  .param.fieldProps.addChoice({ value: 4, label: '4' });

const totalDisplay = builder.insertField('Display')
  .param.setTitle('Total')
  .param.setText('0');

// Attach Summation to update the text based on numeric fields A and B
totalDisplay.addRule('text', 'Summation');

const descriptor = builder.descriptor();
```

When rendered, the `Display` field will automatically update its `text` with the sum of all numeric field values in the form. In this example, it will display the sum of **Value A** and **Value B**. You can add more numeric fields and the summation will include them as long as they are not hidden.
