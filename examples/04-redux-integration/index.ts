import { defaultSchema, FormBuilder } from 'pd-form-core';

// Build a simple form
const builder = new FormBuilder(defaultSchema);
const nameField = builder.insertField('Std.TextInput')
  .param.setLabel('Name');

const descriptor = builder.descriptor();

// Create viewer store and update a field value
const viewerStore = defaultSchema.createViewerStore();
viewerStore.dispatch({
  type: '@form/viewer/setFieldValue',
  payload: {
    fieldId: nameField.fieldId,
    value: 'Jane Doe',
  },
});

console.log('Viewer state:', viewerStore.getState());
