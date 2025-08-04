import { calculableCondition } from "./calculables/condition.ts";
import { calculableSummation } from "./calculables/summation.ts";
import { displayField } from "./fields/display.ts";
import { markdownField } from "./fields/markdown.ts";

import stdCheckbox from "./fields/stdCheckbox.ts";
import { stdScoreField } from "./fields/stdScore.ts";
import stdTextInputField from "./fields/stdTextInput.ts";

import FormSchema from "./FormSchema.ts";

const defaultSchema = new FormSchema({
  version: "1.0.0",
  fieldDescriptor: (t) =>
    t.append([
      // fields
      // optionField,
      // scoreField,
      displayField,
      markdownField,
      // textInputField,

      // std field
      stdTextInputField,
      stdScoreField,
      stdCheckbox,

      // calculables
      calculableCondition,
      calculableSummation,
    ]),
});

export default defaultSchema;
