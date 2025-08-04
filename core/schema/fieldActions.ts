import { createUId } from "../helpers.ts";
import {
  selectFieldAsync,
  _setSelectedFieldId,
} from "../store/editor/actions.ts";
import { AppThunk } from "../store/schemas.ts";
import { InsertFieldPosition } from "./types.ts";

export function insertField(
  fieldClass: string,
  /** which section. pass undefined to create new section */
  sectionIndex: number | undefined,
  position: InsertFieldPosition,
  createdId?: string
) {
  return {
    type: `@form/insertField`,
    payload: {
      fieldClass,
      position,
      sectionIndex,
      createdId,
    },
  } as const;
}

export function _removeFieldAlone(fieldId: string) {
  return {
    type: "@form/removeField",
    payload: {
      fieldId,
    },
  } as const;
}

/**
 * remove field and deselect
 */
export function removeField(fieldId: string): AppThunk {
  return (dispatch, getState) => {
    dispatch(_removeFieldAlone(fieldId));
    if (getState().editor.selectedFieldId === fieldId) {
      dispatch(_setSelectedFieldId(null));
    }
  };
}

export function insertFieldAutoSelect(
  fieldClass: string,
  sectionIndex: number | undefined,
  position: InsertFieldPosition
): AppThunk {
  return (dispatch, getState) => {
    const newFieldID = createUId("", Object.keys(getState().form.fields));
    dispatch(insertField(fieldClass, sectionIndex, position, newFieldID));
    dispatch(selectFieldAsync(newFieldID));
  };
}

/**
 * directly set field params without running through field param reducer
 */
export function setParams(
  fieldId: string,
  params: Dictionary<any>,
  merge = false
) {
  return {
    type: "@form/setParams",
    payload: {
      fieldId,
      params,
      merge,
    },
  } as const;
}

export function setFieldClass(fieldId: string, fieldClass: string) {
  return {
    type: "@form/setFieldClass",
    payload: {
      fieldId,
      fieldClass,
    },
  } as const;
}
