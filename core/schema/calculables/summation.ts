import { Builder } from "../types.ts";

export function calculableSummation(t: Builder) {
  return t.calculable("Summation", {
    type: "number",
    initialParams: {},
    calculate: ({ data, descriptor }) => {
      let result = 0;
      Object.entries(data).forEach(([field, value]) => {
        // skip hidden field
        if (descriptor.fields[field]?.hidden) return;

        const number = Number(value);
        if (!Number.isNaN(number)) {
          result += number;
        }
      });

      return result;
    },
  });
}
