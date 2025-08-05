import { FormBuilder, defaultSchema } from 'pd-form-core';

const fb = new FormBuilder(defaultSchema);

// Age field
const age = fb.insertField('Std.ScoreField')
  .param.setLabel('Age')
  .param.addChoice({ value: 18, label: '18' })
  .param.addChoice({ value: 65, label: '65' });

// Comments field
const comments = fb.insertField('Std.TextInput')
  .param.setLabel('Comments')
  .param.setPlaceholder('Additional notes');

// Hide comments when age is empty
const rule = comments.addRule('hidden', 'Condition');
rule.setCompareField(0, 0, age.fieldId);
rule.setOperator(0, 0, 'is-empty');
rule.setInsideLogic(0, 'and');
rule.setOutsideLogic(0, 'and');

const descriptor = fb.descriptor();
console.log(JSON.stringify(descriptor, null, 2));
