import { AppThunk } from "../schemas.ts";
import type { ExposedAction } from "./types.ts";

export function _setSelectedFieldId(id: string | null) {
  return {
    type: `@editor/setSelectedFieldId`,
    payload: { fieldId: id },
  } as const;
}

export function selectFieldAsync(id: string | null): AppThunk {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(_setSelectedFieldId(id));
    }, 0);
  };
}

export function exposeAction(id: string, action: ExposedAction) {
  // console.log('expose', id);
  return {
    type: `@editor/exposeAction`,
    payload: { id, action },
  } as const;
}

export function unexposeAction(id: string) {
  // console.log('--expose', id);
  return {
    type: "@editor/unexposeAction",
    payload: id,
  } as const;
}
