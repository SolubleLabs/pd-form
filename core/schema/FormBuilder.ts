// @deno-types="npm:@types/lodash"
import _ from "lodash";
import { Store } from "redux";
import { createUId } from "../helpers.ts";
import { AppDispatch } from "../store/schemas.ts";
import * as fieldActions from "./fieldActions.ts";
import FormSchema from "./FormSchema.ts";
import { deepBindParmActionCreators } from "./params.ts";
import * as ruleActions from "./ruleActions.ts";
import {
  Builder,
  EditorStore,
  FOOTER_SECTION_INDEX,
  ParamApi,
} from "./types.ts";
import {
  DeepPartial,
  ExtractCalculableClass,
  ExtractCalculableDeepReducer,
  ExtractDeepReducer,
  ExtractFieldClass,
  ExtractOverridablePath,
  ExtractParam,
} from "./utilityTypes.ts";

export default class FormBuilder<S extends FormSchema<Builder<any, any>>> {
  readonly schema: S;
  readonly store: Store<EditorStore>;

  constructor(schema: S) {
    // rebuild schema with programmatic = true
    const _s = schema.programmatic() as S;

    this.schema = _s;
    this.store = _s.createEditorStore();
  }

  insertField<F extends ExtractFieldClass<S>>(fieldClass: F, id?: string) {
    return this._insertField(fieldClass, 0, id);
  }

  insertFooter<F extends ExtractFieldClass<S>>(fieldClass: F, id?: string) {
    return this._insertField(fieldClass, FOOTER_SECTION_INDEX, id);
  }

  private _insertField<F extends ExtractFieldClass<S>>(
    fieldClass: F,
    sectionIndex: number,
    id?: string
  ) {
    if (!this.schema.hasFieldClass(fieldClass))
      throw new Error(`FieldClass "${fieldClass}" does not exist.`);

    const fid =
      id || createUId("", Object.keys(this.store.getState().form.fields));
    this.store.dispatch(
      fieldActions.insertField(fieldClass, sectionIndex, ["last"], fid)
    );
    const { fieldClassToReducerIdToActionCreatorsMap } =
      this.schema.getfieldClassMap();

    const api = {
      fieldId: fid,
      param: makeChainableDeep(
        deepBindParmActionCreators(
          fid,
          fieldClassToReducerIdToActionCreatorsMap[fieldClass],
          this.store.dispatch
        ) as ParamApi<ExtractDeepReducer<S, F>>
      ),
      setParams: (params: ExtractParam<S, F>) => {
        this.store.dispatch(fieldActions.setParams(fid, params, false));
        return api;
      },
      /** Merge with existing params using lodash `mergeWith()` which concat array instead of per element merge */
      mergeParams: (params: DeepPartial<ExtractParam<S, F>>) => {
        this.store.dispatch(fieldActions.setParams(fid, params, true));
        return api;
      },
      remove: () =>
        (this.store.dispatch as AppDispatch)(fieldActions.removeField(fid)),
      addRule: <C extends ExtractCalculableClass<S>>(
        path: ExtractOverridablePath<S, F>,
        calculableClass: C
      ) => {
        // will throw if incompat
        this.schema.validateRuleCompatible(fieldClass, path, calculableClass);
        const fullPath = `${fid}.${path}`;
        this.store.dispatch(ruleActions.addRule(fullPath, calculableClass));
        return this.createRuleHandle(fullPath, calculableClass);
      },
    } as const;

    return api;
  }

  /**
   * Get result form descriptor
   */
  descriptor() {
    return this.store.getState().form;
  }

  private createRuleHandle<
    P extends string,
    C extends ExtractCalculableClass<S>
  >(path: P, calculableClass: C) {
    const { calculableClassToReducerIdToActionCreatorsMap } =
      this.schema.getCalculableClassMap();
    return makeChainableDeep(
      deepBindParmActionCreators(
        path,
        calculableClassToReducerIdToActionCreatorsMap[calculableClass],
        this.store.dispatch
      ) as ParamApi<ExtractCalculableDeepReducer<S, C>>
    );
  }
}

type DeepFuncDict = {
  [K: string]: ((...args: any[]) => any) | DeepFuncDict;
};

type DeepChainable<F> = {
  [K in keyof F]: F[K] extends (...args: infer L) => void
    ? (...args: L) => DeepChainable<F>
    : F[K] extends Dictionary<any>
    ? DeepChainable<F[K]>
    : never;
};

function makeChainableDeep<F extends DeepFuncDict>(funcDict: F) {
  const _make = (dict: DeepFuncDict): DeepChainable<F> => {
    return _.mapValues(dict, (funcOrDict: any) => {
      if (typeof funcOrDict === "object") return _make(funcOrDict);

      return (...args: any[]) => {
        funcOrDict(...args);
        return _make(dict);
      };
    }) as DeepChainable<F>;
  };

  return _make(funcDict);
}
