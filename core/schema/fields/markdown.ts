import { Builder } from "../types.ts";

export function markdownField(t: Builder) {
  return t.append("Markdown", {
    initialParams: {
      markdown: "",
    },
    initialValue: undefined,
    paramReducers: {
      setMarkdown: (p, markdown: string) => {
        p.markdown = markdown;
      },
    },
  });
}
