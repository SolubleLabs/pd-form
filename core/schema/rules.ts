import { produce } from "immer";
import { set } from "lodash";
import FormSchema from "./FormSchema.ts";
import { FormDescriptor } from "./types.ts";

export function applyRules(
  schema: FormSchema,
  descriptor: FormDescriptor,
  data: Dictionary<any>
) {
  return produce(descriptor, (draft) => {
    const { rules } = descriptor;
    // workaround to make hidden rules being calculated first
    // so that they can be read by later rules
    const entries = Object.entries(rules);
    const hiddens: typeof entries = [];
    const others: typeof entries = [];
    entries.forEach((entry) => {
      if (isRuleForHidden(entry[0] as string)) hiddens.push(entry);
      else others.push(entry);
    });
    const sorted = hiddens.concat(others);

    for (const [path, { calculableClass, params }] of sorted) {
      const calculate = schema.getCalculate(calculableClass);
      if (!calculate) continue;

      const result = calculate({ data, descriptor: draft, params });
      set(draft.fields, path, result);
    }
  });
}

const pattern = /^\w+\.hidden$/;

export function isRuleForHidden(path: string) {
  return pattern.test(path);
}
