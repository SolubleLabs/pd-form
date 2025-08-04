// @deno-types="npm:@types/lodash"
import _ from "lodash";
import * as actions from "./actions.ts";
import { EditorState, initialState } from "./types.ts";
import type { ActionTypes } from "../schemas.ts";

export default function editorReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): EditorState {
  switch (action.type) {
    case "@editor/setSelectedFieldId":
      return {
        ...state,
        selectedFieldId: action.payload.fieldId,
      };
    case "@editor/exposeAction":
      return {
        ...state,
        actionMenu: {
          ...state.actionMenu,
          [action.payload.id]: action.payload.action,
        },
      };
    case "@editor/unexposeAction":
      return {
        ...state,
        actionMenu: _.omit(state.actionMenu, action.payload),
      };
    default:
      return state;
  }
}
