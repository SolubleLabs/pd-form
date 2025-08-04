// @deno-types="npm:@types/lodash"
import _ from "lodash";

import {
  Builder,
  DeepParamReducers,
  FieldClassMeta,
  Overridable,
  PrefixKey,
} from "../types.ts";
import { StdFieldLayout } from "./types.ts";

export const std =
  <
    T extends string,
    P,
    V,
    R extends DeepParamReducers<P>,
    O extends Overridable<any> = {}
  >(field: {
    type: T;
    initialParams: P;
    initialValue: V;
    paramReducers: R;
    overridable?: O;
    meta?: FieldClassMeta<P>;
  }) =>
  <B extends Builder>(builder: B) => {
    const { initialParams, initialValue, type, paramReducers, overridable } =
      field;
    const fieldClass = `Std.${type}` as `Std.${T}`;
    const _ov = _.mapKeys(
      overridable,
      (_: any, k: any) => `fieldProps.${k}`
    ) as PrefixKey<O, "fieldProps">;

    return builder.append(fieldClass, {
      initialParams: {
        fieldProps: initialParams,
        required: false,
        label: "",
        description: "",
        tooltips: "",
        layout: "horizontal" as StdFieldLayout,
        requiredErrorMessage: '"{name}" is a required field',
      },
      initialValue,
      paramReducers: {
        setLabel: (p, label: string) => {
          p.label = label;
        },
        setdescription: (p, description: string) => {
          p.description = description;
        },
        setTooltips: (p, tooltips: string) => {
          p.tooltips = tooltips;
        },
        setLayout: (p, layout: StdFieldLayout) => {
          p.layout = layout;
        },
        setRequired: (p, required: boolean) => {
          p.required = required;
        },
        setRequiredErrorMessage: (p, message: string) => {
          p.requiredErrorMessage = message;
        },
        fieldProps: paramReducers,
      },
      overridable: {
        ..._ov,
        required: {
          label: "Required",
          type: "boolean",
        },
      },
      meta: {
        getLabel: (p) => p.label,
        onValidate: (p, value) => {
          if (p.required) {
            let empty = false;
            if (typeof value === "string") empty = !value.trim();
            else if (Array.isArray(value)) empty = value.length == 0;
            else empty = value == null;

            if (empty) return p.requiredErrorMessage.replace("{name}", p.label);
            else return undefined;
          }

          return undefined;
        },
      },
    });
  };
