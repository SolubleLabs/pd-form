import { produce } from "immer";
// @deno-types="npm:@types/lodash"
import _ from "lodash";
import { Reducer } from "redux";
import {
  createUId,
  insertFieldToArray,
  insertFieldToLayout,
  removeFieldFromLayout,
  removeFieldRules,
  removeParamsRules,
  switchReducer,
} from "../helpers.ts";
import { ActionTypes } from "../store/schemas.ts";
import * as fieldActions from "./fieldActions.ts";
import {
  FieldAction,
  FOOTER_SECTION_INDEX,
  FormDescriptor,
  initialState as emptyInitState,
  isFieldAction,
  RuleAction,
} from "./types.ts";

export function createFormDescriptorReducer(
  fieldClassToReducerMap: Dictionary<Reducer | Reducer<any, FieldAction<any>>>,
  initialState: FormDescriptor = emptyInitState,
  ruleReducer?: (
    state: FormDescriptor["rules"],
    action: RuleAction
  ) => FormDescriptor["rules"]
) {
  const fieldParamReducer = switchReducer(fieldClassToReducerMap);

  return (
    state = initialState,
    action: ActionTypes<typeof fieldActions>
  ): FormDescriptor => {
    /** maybe field action */
    if (isFieldAction(action)) {
      const currFieldState = state.fields[action.targetField];
      if (!currFieldState) return state;

      // apply field reducer and check for change
      const nextParams = fieldParamReducer(
        currFieldState.fieldClass,
        currFieldState.params,
        action
      );
      if (nextParams === currFieldState.params) {
        return state;
      } else {
        return {
          ...state,
          fields: {
            ...state.fields,
            [action.targetField]: {
              ...currFieldState,
              params: nextParams,
            },
          },
        };
      }
    }

    /** maybe rule action */
    if (ruleReducer) {
      const currentRules = state.rules;
      const nextRules = ruleReducer(currentRules, action as any);
      if (currentRules !== nextRules)
        return {
          ...state,
          rules: nextRules,
        };
    }

    /**  descriptor action */
    switch (action.type) {
      case "@form/insertField": {
        const { fieldClass, sectionIndex, position, createdId } =
          action.payload;
        const id = createdId ?? createUId("", Object.keys(state.fields));

        if (state.fields[id] != null) {
          console.warn(`Duplicated field id "${id}". Ignored`);
          return state;
        }

        return produce(state, (s) => {
          s.fields[id] = {
            fieldClass,
            hidden: false,
            params: fieldParamReducer(fieldClass, undefined, action), // initialize params
          };

          if (sectionIndex == FOOTER_SECTION_INDEX) {
            if (!s.layout.footer) {
              s.layout.footer = { fields: [id] };
            } else {
              s.layout.footer.fields = insertFieldToArray(
                s.layout.footer.fields,
                position,
                id
              );
            }
          } else {
            s.layout.sections = insertFieldToLayout(
              state.layout.sections,
              sectionIndex,
              id,
              position
            );
          }
        });
      }
      case "@form/removeField": {
        const { fieldId } = action.payload;
        return produce(state, (s) => {
          s.fields = _.omit(s.fields, fieldId);
          // maybe inside footer
          const idx = s.layout.footer?.fields.indexOf(fieldId);
          if (idx != null && idx >= 0) {
            s.layout.footer?.fields.splice(idx, 1);
          } else {
            s.layout.sections = removeFieldFromLayout(
              s.layout.sections,
              fieldId
            );
          }
          // remove rules
          s.rules = removeFieldRules(s.rules, fieldId);
        });
      }
      case "@form/setParams": {
        const { fieldId, params, merge: do_merge } = action.payload;
        if (!state.fields[fieldId]) return state;
        return {
          ...state,
          fields: {
            ...state.fields,
            [fieldId]: {
              ...state.fields[fieldId],
              params: !do_merge
                ? params
                : produce(state.fields[fieldId].params, (p) =>
                    _.mergeWith(p, params, customizer)
                  ),
            },
          },
        };
      }
      case "@form/setFieldClass": {
        const { fieldId, fieldClass } = action.payload;

        if (
          !state.fields[fieldId] ||
          state.fields[fieldId].fieldClass === fieldClass
        )
          return state;

        return {
          ...state,
          fields: {
            ...state.fields,
            [fieldId]: {
              ...state.fields[fieldId],
              fieldClass,
              params: fieldParamReducer(fieldClass, undefined, action), // initialize params
            },
          },
          rules: removeParamsRules(state.rules, fieldId),
        };
      }
      default:
        return state;
    }
  };
}

function customizer(objValue: any, srcValue: any) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
