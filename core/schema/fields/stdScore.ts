import { Builder } from "../types.ts";
import type { ScoreFieldChoice, ScoreFieldLayout } from "./score.ts";
import { std } from "./std.ts";

export function stdScoreField(t: Builder) {
  return t.append(
    std({
      type: "ScoreField",
      initialParams: {
        choiceLayout: "horizontal" as ScoreFieldLayout,
        choices: [] as ScoreFieldChoice<string | number>[],
        showOther: false,
        placeholder: undefined as string | undefined,
      },
      initialValue: "" as string | number | undefined,
      paramReducers: {
        setChoiceLayout: (p, layout: ScoreFieldLayout) => {
          p.choiceLayout = layout;
        },
        addChoice: (p, choice?: ScoreFieldChoice<string | number>) => {
          p.choices.push(
            choice ?? { label: "", value: "", additionalLabel: "" }
          );
        },
        removeChoice: (p, index: number) => {
          p.choices.splice(index, 1);
        },
        setChoice: (p, index: number, choice: Partial<ScoreFieldChoice>) => {
          const { value, label, additionalLabel } = choice;
          if (value != null) p.choices[index].value = value;
          if (label != null) p.choices[index].label = label;
          if (additionalLabel != null)
            p.choices[index].additionalLabel = additionalLabel;
        },
        clearEmpty: (p) => {
          p.choices = p.choices.filter(({ value: v }) => {
            return `${v}`.trim() != "" && v != null;
          });
        },
      },
    })
  );
}
