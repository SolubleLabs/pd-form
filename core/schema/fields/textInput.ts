import { Builder } from "../types.ts";
import type { ScoreFieldLayout } from "./score.ts";
import type { KeyboardTypeOptions } from "./types.ts";

export function textInputField(t: Builder) {
  return t.append("TextInput", {
    initialParams: {
      label: "",
      description: "",
      tooltips: "",
      placeholder: "",
      layout: "horizontal" as ScoreFieldLayout,
      keyboardType: undefined as KeyboardTypeOptions | undefined,
    },
    initialValue: "" as string | undefined,
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
      setPlaceholder: (p, placeholder: string) => {
        p.placeholder = placeholder;
      },
      setKeyboardType: (
        p,
        keyboardType: KeyboardTypeOptions | undefined = undefined
      ) => {
        p.keyboardType = keyboardType;
      },
    },
  });
}
