import { Draft } from "immer";
import { Action } from "redux";
import { EditorState } from "../store/editor/types.ts";
import { ViewerFieldState } from "../store/viewer/fieldStateSlice.ts";

export type FormSection = {
  sectionTitle: string;
  sectionDescription: string;
  fields: string[];
};

export type FieldApi = Readonly<{
  fieldClass: string;
  fieldId: string;
  sectionIndex: number;
  // field actions
  insertFieldAtCurrentSection: (
    fieldClass: string,
    position: InsertFieldPosition,
    autoSelect?: boolean
  ) => void;
  removeField: () => void;
  setFieldClass: (fieldClass: string) => void;
  // rule actions
  addRule: (relPath: string, calculableClass: string) => void;
  removeRule: (relPath: string) => void;
  setRuleType: (relPath: string, calculableClass: string) => void;
}>;

export type ViewerApi<V> = Readonly<{
  fieldId: string;
  sectionIndex: number;
  setValue: (value: V) => void;
  handleBlur: () => void;
  clearValue: () => void;
}>;

/** dispatch actions derived from param reducers */
export type ParamApi<PRD> = BoundActionCreators<
  ActionCreatorsFromDeepParamReducers<PRD>
>;

export type StdProps = {
  required: boolean;
};

export type CommonOverridableKey = "hidden";

export type Overridable<O extends string | never = never> = {
  [K in O]: {
    type: string | string[];
    label: string;
  };
};

/**
 * first argument must be params !!!
 */
export type FieldClassMeta<P> = {
  getLabel?: (params: P) => string;
  onValidate?: (params: P, value: any) => string | undefined;
};

export type FieldDescriptor<
  P = any,
  V = any,
  R extends DeepParamReducers<P> = {},
  O extends Overridable = {}
> = {
  initialParams: P;
  initialValue: V;
  paramReducers?: R;
  overridable?: O;
  meta?: FieldClassMeta<P>;
};

export type ParamReducers<P, L> = {
  [K: string]: (params: P, ...payload: L[]) => P;
};

export type PrefixKey<T, P extends string> = {
  [K in keyof T as `${P}.${Exclude<K, number | symbol>}`]: T[K];
};

type DescriptorOfBuilder<T extends Builder> = T extends Builder<infer D, any>
  ? Exclude<D, Dictionary<never>>
  : never;

type CalculableOfBuilder<T extends Builder> = T extends Builder<any, infer C>
  ? Exclude<C, Dictionary<never>>
  : never;

type UnionToIntersect<T> = (T extends any ? (a: T) => any : never) extends (
  a: infer U
) => any
  ? U
  : never;

interface BuilderAppend<Prev, PrevCalculable> {
  <
    C extends string,
    P,
    V,
    R extends DeepParamReducers<P>,
    O extends Overridable<string>
  >(
    fieldClass: C,
    field: {
      initialParams: P;
      initialValue: V;
      paramReducers?: R;
      overridable?: O;
      meta?: FieldClassMeta<P>;
    }
  ): Builder<
    Prev & {
      [K in C]: FieldDescriptor<
        P,
        V,
        R,
        PrefixKey<O, "params"> & Overridable<CommonOverridableKey>
      >;
    },
    PrevCalculable
  >;

  // overload append() to support callback. So that util fn that
  // call append on given builder can still be chained
  <S>(
    callback: (builder: Builder<Prev, PrevCalculable>) => S
  ): S extends Builder<infer P, infer Q>
    ? Builder<Prev & P, PrevCalculable & Q>
    : never;

  // overload to support append array of callbacks
  <S extends (builder: Builder<Prev, PrevCalculable>) => any>(
    callbacks: S[]
  ): ReturnType<S> extends Builder<any, any>
    ? Builder<
        Prev & UnionToIntersect<DescriptorOfBuilder<ReturnType<S>>>,
        PrevCalculable & UnionToIntersect<CalculableOfBuilder<ReturnType<S>>>
      >
    : never;
}

// Calculable

type CalculablePayload<P> = {
  params: P;
  data: Dictionary<any>;
  descriptor: FormDescriptor;
};

export type CalculableDescriptor<
  P = any,
  R extends DeepParamReducers<P> = {}
> = {
  type: string;
  initialParams: P;
  paramReducers?: R;
  calculate: (payload: CalculablePayload<P>) => any;
};
interface BuilderCalculable<Prev, PrevCalculable> {
  <C extends string, P, R extends DeepParamReducers<P>>(
    calculableClass: C,
    calculable: {
      type: string;
      initialParams: P;
      paramReducers?: R;
      calculate: (payload: CalculablePayload<P>) => any;
    }
  ): Builder<Prev, PrevCalculable & { [K in C]: CalculableDescriptor<P, R> }>;
}

export type Builder<Prev = {}, PrevCalculable = {}> = {
  readonly programmatic: boolean;
  get: () => Prev;
  append: BuilderAppend<Prev, PrevCalculable>;
  getCalculables: () => PrevCalculable;
  calculable: BuilderCalculable<Prev, PrevCalculable>;
};

export const FOOTER_SECTION_INDEX = -1;

/**
 * type of descriptor of the form that is being edited in editor
 */
export type FormDescriptor = {
  schemaVersion: string;
  /** user defined form name */
  name: string;
  /** form title */
  title: string;
  /** form field */
  fields: Dictionary<{
    fieldClass: string;
    hidden: boolean;
    /** this will be assigned as component props */
    params: Dictionary<any>;
  }>;
  rules: Dictionary<{
    calculableClass: string;
    params: Dictionary<any>;
  }>;
  /** order and organization of the fields in this form */
  layout: {
    sections: FormSection[];
    footer?: {
      fields: string[];
    };
  };
};

/**
 * editor initial state
 */
export const initialState: FormDescriptor = {
  schemaVersion: "",
  fields: {},
  layout: {
    sections: [],
  },
  name: "",
  title: "",
  rules: {},
};

export type PayloadAction<L = any> = {
  type: string;
  payload: L;
};

/**
 * action that target field param reducer
 */
export type FieldAction<L = any> = PayloadAction<L> & {
  targetField: string;
};

export type RuleAction<L = any> = PayloadAction<L> & {
  targetPath: string;
};

export type WrappedCalculableProps = {
  params: Dictionary<any>;
  targetPath: string;
};

/**
 * props of field component that can be render by field renderer
 */
export type WrappedFieldProps = {
  fieldId: string;
  sectionIndex: number;
  params: Dictionary<any>;
};

export type ExtractKeysWithDict<T> = {
  [K in keyof T]: T[K] extends Record<string, any> ? K : never;
}[keyof T];

export type ActionCreatorsFromDeepParamReducers<R> = {
  [K in keyof R]: R[K] extends (params: any, ...payload: infer L) => infer A
    ? (fieldId: string, ...payload: L) => A
    : ActionCreatorsFromDeepParamReducers<R[K]>;
};

export type NoInfer<T> = T & { [K in keyof T]: T[K] };

export type DeepParamReducers<P = Dictionary<any>> = {
  // TODO: type hint works but this wont prevent 'any' type
  [K: string]: ((p: Draft<P>, ...payload: any[]) => P | void) | Dictionary<any>;
} & {
  [K in ExtractKeysWithDict<P>]?: DeepParamReducers<P[K]>;
};

export type SingleParamReducer<P = any, L extends any[] = any> = (
  params: P,
  ...payload: L
) => P;

export type BoundActionCreators<A> = {
  [K in keyof A]: A[K] extends (fieldId: string, ...payload: infer L) => any
    ? (...payload: L) => void
    : BoundActionCreators<A[K]>;
};

export type EditorStore = {
  editor: EditorState;
  form: FormDescriptor;
};

export type ViewerStore = {
  data: Dictionary<any>;
  fieldState: ViewerFieldState;
};

export type InsertFieldPosition =
  | ["after" | "before", string]
  | ["first" | "last"];

export type InsertArrayPosition =
  | ["after" | "before", number]
  | ["first" | "last"];

export function isRuleAction(action: Action): action is RuleAction {
  const ruleAction = action as RuleAction;
  return (
    ruleAction.targetPath !== undefined && Array.isArray(ruleAction.payload)
  );
}

export function isFieldAction(action: Action): action is FieldAction {
  const fieldAction = action as FieldAction;
  return (
    fieldAction.targetField !== undefined && Array.isArray(fieldAction.payload)
  );
}

export type Maybe<T> = Partial<T>;
