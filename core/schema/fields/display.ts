import { Builder } from "../types.ts";

export function displayField(t: Builder) {
  return t.append("Display", {
    initialParams: {
      title: "",
      text: "" as string | number,
    },
    initialValue: undefined,
    paramReducers: {
      setTitle: (p, title: string) => {
        p.title = title;
      },
      setText: (p, text: string | number) => {
        p.text = text;
      },
    },
    meta: {
      getLabel: (p) => p.title,
    },
    overridable: {
      title: {
        label: "Title",
        type: ["string", "number"],
      },
      text: {
        label: "Text",
        type: ["string", "number"],
      },
    },
  });
}
