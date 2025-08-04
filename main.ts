import { defaultSchema, FormBuilder } from "./core/index.ts";

const b = new FormBuilder(defaultSchema);

b.insertField("Display")
  .mergeParams({
    title: "Test Form",
    text: "some description",
  })
  .addRule("hidden", "Condition")
  .addConditionGroup({
    conditions: [["", "==", ""]],
    joinWithPrev: "and",
    joinInside: "or",
  });

b.insertField("Std.ScoreField").mergeParams({
  label: "What is 1+1 ?",
  description: "Calculate 1+1",
  required: true,
});

console.log(b.descriptor());
