// @deno-types="npm:@types/lodash"
import _ from "lodash";
import { Reducer } from "redux";
import { switchReducer } from "../helpers.ts";
import { ActionTypes } from "../store/schemas.ts";
import * as ruleActions from "./ruleActions.ts";
import {
  FormDescriptor,
  initialState as emptyInitState,
  isRuleAction,
  RuleAction,
} from "./types.ts";

export function createRuleReducer(
  calculableClassToReducerMap: Dictionary<Reducer | Reducer<any, RuleAction>>,
  initialState: FormDescriptor["rules"] = emptyInitState.rules
) {
  const ruleParamReducer = switchReducer(calculableClassToReducerMap);

  return (
    state = initialState,
    action: ActionTypes<typeof ruleActions> | RuleAction
  ): FormDescriptor["rules"] => {
    /** may be rule action on specific path */
    if (isRuleAction(action)) {
      const currRuleState = state[action.targetPath];
      if (!currRuleState) {
        console.warn(`rule at ${action.targetPath} does not exist`);
        return state;
      }

      // apply rule reducer and check for change
      const nextParams = ruleParamReducer(
        currRuleState.calculableClass,
        currRuleState.params,
        action
      );
      if (nextParams === currRuleState.params) {
        return state;
      } else {
        return {
          ...state,
          [action.targetPath]: {
            ...currRuleState,
            params: nextParams,
          },
        };
      }
    }

    /** general rule action */
    switch (action.type) {
      case "@form/addRule": {
        const { calculableClass, targetPath } = action.payload;
        return {
          ...state,
          [targetPath]: {
            calculableClass,
            params: ruleParamReducer(calculableClass, undefined, action), // initialize params
          },
        };
      }
      case "@form/removeRule": {
        const { targetPath } = action.payload;
        return _.omit(state, targetPath);
      }
      case "@form/setRuleType": {
        const { targetPath, calculableClass } = action.payload;
        // same class -> return
        if (state[targetPath]?.calculableClass === calculableClass)
          return state;
        // otherwise init as new rule
        return {
          ...state,
          [targetPath]: {
            calculableClass,
            params: ruleParamReducer(calculableClass, undefined, action), // initialize params
          },
        };
      }
      default:
        return state;
    }
  };
}

export type RuleReducer = ReturnType<typeof createRuleReducer>;
