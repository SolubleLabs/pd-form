import { createAction } from "@reduxjs/toolkit";

export const setFieldValue = createAction<{ fieldId: string; value: any }>(
  "@form/viewer/setFieldValue"
);

export const clearValue = createAction<{ fieldId: string }>(
  "@form/viewer/clearValue"
);
