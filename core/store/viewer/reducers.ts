import { setFieldValue, clearValue } from "./actions";
import { ViewerFormData, initialState } from "./types";

type ViewerActions =
  | ReturnType<typeof setFieldValue>
  | ReturnType<typeof clearValue>;

export default function viewerFormReducer(
  state: ViewerFormData = initialState,
  action: ViewerActions
): ViewerFormData {
  if (setFieldValue.match(action)) {
    const { fieldId, value } = action.payload;
    return { ...state, [fieldId]: value };
  } else if (clearValue.match(action)) {
    const { fieldId } = action.payload;
    const { [fieldId]: _, ...rest } = state;
    return rest;
  }
  return state;
}
