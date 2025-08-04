import { mapKeys } from "lodash";
import {
  Builder,
  DeepParamReducers,
  FieldClassMeta,
  Overridable,
  PrefixKey,
} from "../types.ts";

export const questionnaireField =
  <
    T extends string,
    P,
    V,
    R extends DeepParamReducers<P>,
    O extends Overridable<any> = {}
  >(response: {
    type: T;
    initialParams: P;
    initialValue: V;
    paramReducers: R;
    overridable?: O;
    meta?: FieldClassMeta<P>;
  }) =>
  <B extends Builder>(builder: B) => {
    const { initialParams, initialValue, type, paramReducers, overridable } =
      response;
    const fieldClass = `Questionnaire.${type}` as `Questionnaire.${T}`;
    const _ov = mapKeys(
      overridable,
      (_: any, k: any) => `responseProps.${k}`
    ) as PrefixKey<O, "responseProps">;

    return builder.append(fieldClass, {
      initialParams: {
        question: "",
        required: false,
        responseProps: initialParams,
      },
      initialValue,
      paramReducers: {
        setQuestion: (p, question: string) => {
          p.question = question;
        },
        setRequired: (p, required: boolean) => {
          p.required = required;
        },
        responseProps: paramReducers,
      },
      overridable: {
        ..._ov,
        required: {
          label: "Required",
          type: "boolean",
        },
      },
      meta: {
        getLabel: response.meta?.getLabel
          ? (p) => response.meta!.getLabel!(p.responseProps)
          : (p) => p.question,
      },
    });
  };
