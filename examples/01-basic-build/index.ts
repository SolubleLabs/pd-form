import { FormBuilder, defaultSchema } from 'pd-form-core';

const builder = new FormBuilder(defaultSchema);

// Insert a simple text input field
const nameField = builder.insertField('Std.TextInput')
  .param.setLabel('Patient Name')
  .param.setPlaceholder('First and Last');

// Snapshot descriptor
const descriptor = builder.descriptor();
console.log(JSON.stringify(descriptor, null, 2));
