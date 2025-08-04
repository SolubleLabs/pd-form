import { Builder } from "../types.ts";
import { GenericChoice, genericChoiceParamReducer } from "./choices.ts";
import { questionnaireField } from "./questionnaire.ts";

export default function optionField(t: Builder) {
  return t.append(
    questionnaireField({
      type: "Option",
      initialParams: {
        choices: [] as GenericChoice[],
      },
      initialValue: "" as string | number | undefined,
      paramReducers: genericChoiceParamReducer,
    })
  );
}
