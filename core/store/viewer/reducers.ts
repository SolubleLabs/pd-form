import { ActionTypes } from "../schemas.ts";
import * as Actions from "./actions.ts";
import { initialState, ViewerFormData } from "./types.ts";

export default function viewerFormReducer(
  state = initialState,
  action: ActionTypes<typeof Actions>
): ViewerFormData {
  switch (action.type) {
    case "@form/viewer/setFieldValue": {
      const { fieldId, value } = action.payload;
      return { ...state, [fieldId]: value };
    }
    default:
      return state;
  }
}
