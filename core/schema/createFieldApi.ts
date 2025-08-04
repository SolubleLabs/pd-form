import { AppDispatch } from "../store/schemas.ts";
import * as fieldActions from "./fieldActions.ts";
import * as ruleActions from "./ruleActions.ts";
import { FieldApi } from "./types.ts";

export function createFieldApi(
  dispatch: AppDispatch,
  fieldId: string,
  sectionIndex: number,
  thisFieldClass: string
): FieldApi {
  return {
    fieldClass: thisFieldClass,
    fieldId,
    sectionIndex,
    // **** field actions ****
    insertFieldAtCurrentSection: (fieldClass, position, autoSeclect) => {
      if (autoSeclect)
        return dispatch(
          fieldActions.insertFieldAutoSelect(fieldClass, sectionIndex, position)
        );
      else
        return dispatch(
          fieldActions.insertField(fieldClass, sectionIndex, position)
        );
    },
    removeField: () => dispatch(fieldActions.removeField(fieldId)),

    // **** rule action ****
    addRule: (relPath, calculableClass) =>
      dispatch(ruleActions.addRule(`${fieldId}.${relPath}`, calculableClass)),
    removeRule: (relPath) =>
      dispatch(ruleActions.removeRule(`${fieldId}.${relPath}`)),
    setRuleType: (relPath, calculableClass) =>
      dispatch(
        ruleActions.setRuleType(`${fieldId}.${relPath}`, calculableClass)
      ),
    setFieldClass: (fieldClass: string) =>
      dispatch(fieldActions.setFieldClass(fieldId, fieldClass)),
  };
}
