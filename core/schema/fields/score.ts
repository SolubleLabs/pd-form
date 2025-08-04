import { Builder } from "../types.ts";

export type ScoreFieldLayout = "horizontal" | "vertical";
export type ScoreFieldChoice<V = number | string> = {
  value: V;
  label?: string;
  additionalLabel?: string;
};

export const LayoutChoices: ScoreFieldChoice<ScoreFieldLayout>[] = [
  { value: "horizontal", label: "Side by side" },
  { value: "vertical", label: "Single" },
];

export function scoreField(t: Builder) {
  return t.append("ScoreField", {
    initialParams: {
      label: "",
      description: "",
      tooltips: "",
      layout: "horizontal" as ScoreFieldLayout,
      choiceLayout: "horizontal" as ScoreFieldLayout,
      choices: [] as ScoreFieldChoice<string | number>[],
    },
    initialValue: "" as string | number | undefined,
    meta: {
      getLabel: (p) => p.label,
    },
    paramReducers: {
      setLabel: (p, label: string) => {
        p.label = label;
      },
      setDescription: (p, description: string) => {
        p.description = description;
      },
      setTooltips: (p, tooltips: string) => {
        p.tooltips = tooltips;
      },
      setLayout: (p, layout: ScoreFieldLayout) => {
        p.layout = layout;
      },
      setChoiceLayout: (p, layout: ScoreFieldLayout) => {
        p.choiceLayout = layout;
      },
      addChoice: (p, choice?: ScoreFieldChoice<string | number>) => {
        p.choices.push(choice ?? { label: "", value: "", additionalLabel: "" });
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
  });
}
