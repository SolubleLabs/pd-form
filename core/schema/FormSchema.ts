import { configureStore, Reducer } from "@reduxjs/toolkit";
import editorReducer from "../store/editor/reducers.ts";
import fieldStateSlice from "../store/viewer/fieldStateSlice.ts";
import viewerFormReducer from "../store/viewer/reducers.ts";
import { createBuilder } from "./createBuilder.ts";
import { createFormDescriptorReducer } from "./createFormDescriptorReducer.ts";
import { createRuleReducer } from "./createRuleReducer.ts";
import {
  createFieldAction,
  createParamActionCreatorsAndReducer,
  createRuleAction,
} from "./params.ts";
import {
  Builder,
  CalculableDescriptor,
  FieldAction,
  FieldDescriptor,
  FormDescriptor,
  initialState,
  Overridable,
  RuleAction,
} from "./types.ts";

export default class FormSchema<
  B extends Builder<
    // field
    Record<string, FieldDescriptor<any, any, any, {}>>,
    // calculable
    Record<string, CalculableDescriptor<any, any>>
  > = Builder
> {
  private readonly _programmatic: boolean;
  readonly version: string;

  private _descriptorFunction;
  private _builder: B | undefined = undefined;
  private _fieldClassToReducerMap:
    | Dictionary<Reducer<any, FieldAction<any>>>
    | undefined;
  private _fieldClassToToReducerIdToActionCreatorsMap:
    | Dictionary<Dictionary<(fieldId: string, payload: any) => FieldAction>>
    | undefined;

  // calculables
  private _calculableClassToReducerMap:
    | Dictionary<Reducer<any, RuleAction<any>>>
    | undefined;
  private _calculableClassToToReducerIdToActionCreatorsMap:
    | Dictionary<Dictionary<(fieldId: string, payload: any) => RuleAction>>
    | undefined;

  constructor(
    schema: { version: string; fieldDescriptor: (builder: Builder) => B },
    _programmatic = false
  ) {
    this._programmatic = _programmatic;
    const { version, fieldDescriptor } = schema;
    this.version = version;
    this._descriptorFunction = fieldDescriptor;
  }

  /**
   * return built builder
   */
  builder(): B {
    if (!this._builder) {
      this._builder = createBuilder(this._programmatic) as B;
      this._descriptorFunction(this._builder);
    }

    return this._builder;
  }

  programmatic() {
    if (this._programmatic) return this;

    return new FormSchema(
      { version: this.version, fieldDescriptor: this._descriptorFunction },
      true
    );
  }

  createEditorStore() {
    const { fieldClassToReducerMap } = this.getfieldClassMap();
    const { calculableClassToReducerMap } = this.getCalculableClassMap();

    const ruleReducer = createRuleReducer(calculableClassToReducerMap);

    const initState: FormDescriptor = {
      ...initialState,
      schemaVersion: this.version,
    };

    return configureStore({
      reducer: {
        editor: editorReducer as Reducer,
        form: createFormDescriptorReducer(
          fieldClassToReducerMap,
          initState,
          ruleReducer
        ) as Reducer,
      },
    });
  }

  createViewerStore(initialData?: Dictionary<any>) {
    return configureStore({
      reducer: {
        data: viewerFormReducer as Reducer,
        fieldState: fieldStateSlice,
      },
      preloadedState: initialData
        ? {
            data: initialData,
            fieldState: { touched: {}, errors: {} },
          }
        : undefined,
    });
  }

  getFieldClassList() {
    return Object.keys(this.builder().get());
  }

  hasFieldClass(fieldClass: string) {
    return !!this.builder().get()[fieldClass];
  }

  /**
   * get field param paths that declared overridable by rule
   */
  getOverridable(fieldClass: string | undefined | null): Overridable<any> {
    if (!fieldClass) return {};

    const d = this.builder().get();
    const f = d[fieldClass];
    return f?.overridable ?? {};
  }

  getFieldClassMeta(fieldClass: string | undefined | null) {
    if (!fieldClass) return undefined;
    const d = this.builder().get();
    const f = d[fieldClass];
    return f?.meta;
  }

  /**
   * throw if incompat
   */
  validateRuleCompatible(
    fieldClass: string,
    path: string,
    calculableClass: string
  ) {
    const d = this.builder().get()[fieldClass];
    const c = this.builder().getCalculables()[calculableClass];

    if (!d) throw new Error(`FieldClass "${fieldClass}" does not exist`);
    if (!c)
      throw new Error(`CalculableClass "${calculableClass}" does not exist`);

    const overridableType = (
      d.overridable as Overridable<string> | undefined
    )?.[path].type;
    if (!overridableType) throw new Error(`"${path}" is not overridable`);

    const targetTypes = Array.isArray(overridableType)
      ? overridableType
      : [overridableType];

    if (!targetTypes.includes(c.type))
      throw new Error(
        `Rule type incompatible. "${path}" expect ${overridableType} ` +
          `but calculable "${calculableClass}" return ${c.type}`
      );
  }

  getCalculate(
    calculableClass: string
  ): CalculableDescriptor["calculate"] | undefined {
    return this.builder().getCalculables()[calculableClass]?.calculate;
  }

  /**
   * get all calculables with matching type
   * @returns `[calculableClass, descriptor][]`
   */
  getCalculableForType(type: string | string[]) {
    const d = this.builder().getCalculables();
    return Object.entries(d).filter(([_, desc]) =>
      Array.isArray(type) ? type.includes(desc.type) : desc.type === type
    );
  }

  private _createActionCreatorsAndReducerMap() {
    this._fieldClassToReducerMap = {};
    this._fieldClassToToReducerIdToActionCreatorsMap = {};

    const d = this.builder().get();

    Object.entries(d).forEach(([fieldClass, descriptor]) => {
      const { paramReducers, initialParams } = descriptor;
      if (paramReducers) {
        const { actionCreators, reducer } = createParamActionCreatorsAndReducer(
          fieldClass,
          initialParams,
          paramReducers,
          "field",
          createFieldAction
        );
        this._fieldClassToReducerMap![fieldClass] = reducer;
        this._fieldClassToToReducerIdToActionCreatorsMap![fieldClass] =
          actionCreators as any;
      }
    });
  }

  private _createCalculableActionCreatorsAndReducerMap() {
    this._calculableClassToReducerMap = {};
    this._calculableClassToToReducerIdToActionCreatorsMap = {};

    const d = this.builder().getCalculables();

    Object.entries(d).forEach(([calculableClass, descriptor]) => {
      const { paramReducers, initialParams } = descriptor;
      if (paramReducers) {
        const { actionCreators, reducer } = createParamActionCreatorsAndReducer(
          calculableClass,
          initialParams,
          paramReducers,
          "calculable",
          createRuleAction
        );
        this._calculableClassToReducerMap![calculableClass] = reducer;
        this._calculableClassToToReducerIdToActionCreatorsMap![
          calculableClass
        ] = actionCreators as any;
      }
    });
  }

  public getfieldClassMap() {
    if (
      this._fieldClassToReducerMap == null ||
      this._fieldClassToToReducerIdToActionCreatorsMap == null
    )
      this._createActionCreatorsAndReducerMap();

    return {
      fieldClassToReducerMap: this._fieldClassToReducerMap!,
      fieldClassToReducerIdToActionCreatorsMap:
        this._fieldClassToToReducerIdToActionCreatorsMap!,
    };
  }

  public getCalculableClassMap() {
    if (
      this._calculableClassToReducerMap == null ||
      this._calculableClassToToReducerIdToActionCreatorsMap == null
    )
      this._createCalculableActionCreatorsAndReducerMap();

    return {
      calculableClassToReducerMap: this._calculableClassToReducerMap!,
      calculableClassToReducerIdToActionCreatorsMap:
        this._calculableClassToToReducerIdToActionCreatorsMap!,
    };
  }
}
