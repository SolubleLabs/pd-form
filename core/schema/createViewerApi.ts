import { AppDispatch } from "../store/schemas.ts";
import * as viewerActions from "../store/viewer/actions.ts";
import { viewerFieldActions } from "../store/viewer/fieldStateSlice.ts";
import { ViewerApi } from "./types.ts";

export function createViewerApi<V = any>(
  dispatch: AppDispatch,
  fieldId: string,
  sectionIndex: number
): ViewerApi<V> {
  return {
    fieldId,
    sectionIndex,
    setValue: (value: V) => {
      dispatch(viewerActions.setFieldValue({ fieldId, value }));
    },
    clearValue: () => dispatch(viewerActions.clearValue({ fieldId })),
    handleBlur: () => dispatch(viewerFieldActions.touch(fieldId)),
  };
}
