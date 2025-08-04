// @deno-types="npm:@types/lodash"

import _ from "lodash";
import {
  Builder,
  CalculableDescriptor,
  CommonOverridableKey,
  FieldDescriptor,
  Overridable,
} from "./types.ts";

const commonFieldOverridable: Overridable<CommonOverridableKey> = {
  hidden: {
    type: "boolean",
    label: "Hidden",
  },
};

/**
 * this fn is primarily for type hinting
 */
export function createBuilder(programmatic = false): Builder {
  let prev: Record<string, FieldDescriptor> = {};
  let prevCalculable: Record<string, CalculableDescriptor> = {};

  const b: Builder<any, any> = {
    programmatic,
    get: () => prev,
    append: (...args: any[]) => {
      // array of callbacks
      if (args.length == 1 && Array.isArray(args[0])) {
        return args[0].reduce((p, c) => c(p), b);
      }

      // single callback
      if (args.length == 1 && typeof args[0] === "function") return args[0](b);

      // (fieldClass, field)
      if (args.length == 2) {
        const [fieldClass, field, render, renderEditor] = args;
        prev = {
          ...prev,
          [fieldClass]: {
            ...field,
            render,
            renderEditor,
            overridable: {
              ...commonFieldOverridable,
              ..._.mapKeys(
                field.overridable,
                (_: any, k: any) => `params.${k}`
              ),
            },
          },
        };
        return b;
      }

      throw new Error("Invalid arguments");
    },

    // calculable
    getCalculables: () => prevCalculable,
    calculable: (...args: any[]) => {
      const [calculableClass, calculable, render] = args;
      prevCalculable = {
        ...prevCalculable,
        [calculableClass]: { ...calculable, render },
      };
      return b;
    },
  };

  return b;
}
