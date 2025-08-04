import { Builder } from "../types.ts";
import { GenericChoice } from "./choices.ts";
import { std } from "./std.ts";

export default function stdCheckbox(t: Builder) {
  return t.append(
    std({
      type: "Checkbox",
      initialParams: {
        choices: [] as GenericChoice[],
        maxOthers: 0,
      },
      initialValue: [] as GenericChoice["value"][],
      paramReducers: {},
    })
  );
}
