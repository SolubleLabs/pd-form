// @deno-types="npm:@types/lodash"
import _ from "lodash";
import { produce } from "immer";
import { AppDispatch } from "../store/schemas.ts";
import {
  ActionCreatorsFromDeepParamReducers,
  BoundActionCreators,
  DeepParamReducers,
  FieldAction,
  PayloadAction,
  RuleAction,
  SingleParamReducer,
} from "./types.ts";

/**
 * Deep parse param reducers dictionary to action creators map and reducer function
 *
 * ```js
 * paramReducers: {
 *  reducerId: (param, ...payload) => nextParam,
 *  subParams: {
 *      reducerId: (subParams, ...payload) => nextSubParams
 *  }
 * }
 * ```
 * @return
 * ```js
 * {
 *  actionCreators {
 *    reducerId: (fieldId, ...payload) => FieldAction,
 *    subParams: {
 *      reducerId: (fieldId, ...payload) => FieldAction
 *    }
 *  },
 *  reducer: (param, action) => param
 * }
 * ```
 */
export function createParamActionCreatorsAndReducer<
  P extends Record<string, any>,
  R extends DeepParamReducers<P>,
  A extends PayloadAction
>(
  fieldOrCalculableClass: string,
  initialParams: P,
  paramReducers: R,
  typePrefix: string,
  createAction: (type: string, target: string, payload: any[]) => A
) {
  // action creators
  const createActionCreatorAndReducerMap = <D extends DeepParamReducers<any>>(
    pr: D,
    // type => [param reducer, paths[]]
    outReducerMap: Dictionary<[SingleParamReducer, string[]]> = {},
    root: string[] = []
  ): ActionCreatorsFromDeepParamReducers<D> => {
    return _.mapValues(pr, (singleReducerOrDict: any, key: any) => {
      if (typeof singleReducerOrDict === "object")
        return createActionCreatorAndReducerMap(
          singleReducerOrDict,
          outReducerMap,
          [...root, key]
        );
      const type = `@${typePrefix}/${fieldOrCalculableClass}/${[
        ...root,
        key,
      ].join("/")}`;
      outReducerMap[type] = [
        produce(singleReducerOrDict as SingleParamReducer),
        root,
      ];
      return (target: string, ...payload: any[]) =>
        createAction(type, target, payload);
    }) as ActionCreatorsFromDeepParamReducers<D>;
  };

  const flattenedReducerMapIndexedByActionType: Dictionary<
    [SingleParamReducer, string[]]
  > = {};
  const actionCreators = createActionCreatorAndReducerMap(
    paramReducers,
    flattenedReducerMapIndexedByActionType
  );

  // apply param reducer
  const applyReducer = (
    params: P,
    reducer: SingleParamReducer,
    paths: string[],
    action: A
  ) => {
    // dig down the path
    if (paths.length == 0) return reducer(params, ...action.payload);
    else {
      const [nextPath, ...rest] = paths;

      const prevSubparms = params[nextPath];
      const nextSubparms: Dictionary<any> = applyReducer(
        params[nextPath],
        reducer,
        rest,
        action
      );

      if (prevSubparms !== nextSubparms)
        return { ...params, [nextPath]: nextSubparms };
      else return params;
    }
  };

  const deepReducer = (params: P = initialParams, action: A): P => {
    if (flattenedReducerMapIndexedByActionType[action.type] == null)
      return params;

    // console.log('reach_deep_reducer', params, action);

    const [paramReducer, path] =
      flattenedReducerMapIndexedByActionType[action.type];

    return applyReducer(params, paramReducer, path, action);
  };

  return {
    reducer: deepReducer,
    actionCreators,
  };
}

export function deepBindParmActionCreators<
  D extends ActionCreatorsFromDeepParamReducers<any>
>(
  target: string,
  actionCreators: D,
  dispatch: AppDispatch
): BoundActionCreators<D> {
  return _.mapValues(actionCreators, (v: any) => {
    if (typeof v === "object")
      return deepBindParmActionCreators(target, v, dispatch);

    return (...payload: any[]) => dispatch(v(target, ...payload));
  }) as BoundActionCreators<D>;
}

export function createFieldAction(
  type: string,
  target: string,
  payload: any[]
): FieldAction {
  return {
    type,
    targetField: target,
    payload,
  };
}

export function createRuleAction(
  type: string,
  target: string,
  payload: any[]
): RuleAction {
  return {
    type,
    targetPath: target,
    payload,
  };
}
