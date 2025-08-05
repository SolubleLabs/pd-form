import FormSchema from 'pd-form-core/schema/FormSchema';
import { FormBuilder } from 'pd-form-core';

// Define a custom schema with a GyroTremor field
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
        setLabel: (p: any, label: string) => { p.label = label; },
        setThreshold: (p: any, thr: number) => { p.threshold = thr; },
      },
      meta: {
        getLabel: (p: any) => p.label,
      },
    }),
});

// Use the custom schema in a builder
const builder = new FormBuilder(mySchema);

const tremor = builder.insertField('GyroTremor')
  .param.setLabel('Tremor Score')
  .param.setThreshold(5);

// Export and print descriptor
const descriptor = builder.descriptor();
console.log(JSON.stringify(descriptor, null, 2));
