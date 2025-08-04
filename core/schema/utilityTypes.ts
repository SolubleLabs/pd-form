import FormSchema from "./FormSchema.ts";
import type { Builder } from "./types.ts";

export type ExtractFieldClass<T> = T extends FormSchema<
  Builder<Record<infer L, any>, any>
>
  ? Exclude<L, number | symbol>
  : never;

export type ExtractCalculableClass<T> = T extends FormSchema<
  Builder<any, Record<infer L, any>>
>
  ? Exclude<L, number | symbol>
  : never;

type ExtractBuilder<T> = T extends FormSchema<infer B> ? B : never;
type ExtractAllDescriptor<T> = T extends Builder<infer D, any> ? D : never;
type ExtractAllCalculable<T> = T extends Builder<any, infer D> ? D : never;

export type ExtractDescriptor<
  T,
  FieldClass extends ExtractFieldClass<T>
> = ExtractAllDescriptor<ExtractBuilder<T>> extends {
  [K in FieldClass]: infer D;
}
  ? D
  : never;

export type ExtractCalculable<
  T,
  CalculableClass extends ExtractCalculableClass<T>
> = ExtractAllCalculable<ExtractBuilder<T>> extends {
  [K in CalculableClass]: infer D;
}
  ? D
  : never;

export type ExtractDeepReducer<
  T,
  FieldClass extends ExtractFieldClass<T>
> = ExtractAllDescriptor<ExtractBuilder<T>> extends {
  [K in FieldClass]: infer D;
}
  ? D extends { paramReducers?: infer R }
    ? R
    : never
  : never;

export type ExtractCalculableDeepReducer<
  T,
  CalculableClass extends ExtractCalculableClass<T>
> = ExtractAllCalculable<ExtractBuilder<T>> extends {
  [K in CalculableClass]: infer D;
}
  ? D extends { paramReducers?: infer R }
    ? R
    : never
  : never;

export type ExtractOverridablePath<
  T,
  FieldClass extends ExtractFieldClass<T>
> = ExtractAllDescriptor<ExtractBuilder<T>> extends {
  [K in FieldClass]: infer D;
}
  ? D extends { overridable?: infer O }
    ? keyof O
    : never
  : never;

export type ExtractParam<
  T,
  FieldClass extends ExtractFieldClass<T>
> = ExtractAllDescriptor<ExtractBuilder<T>> extends {
  [K in FieldClass]: infer D;
}
  ? D extends { initialParams: infer P }
    ? P
    : never
  : never;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
