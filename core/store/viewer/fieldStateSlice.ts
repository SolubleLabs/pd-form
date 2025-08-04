import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setFieldValue } from "./actions.ts";

export type ViewerFieldState = {
  touched: Dictionary<boolean>;
  errors: Dictionary<string>;
};

const fieldStateSlice = createSlice({
  name: "viewerFieldState",
  initialState: {
    touched: {},
    errors: {},
  } as ViewerFieldState,
  reducers: {
    touch: (state, action: PayloadAction<string | string[]>) => {
      if (Array.isArray(action.payload)) {
        action.payload.forEach((fieldId) => {
          state.touched[fieldId] = true;
        });
      } else {
        state.touched[action.payload] = true;
      }
    },
    reset: (state) => {
      state.errors = {};
      state.touched = {};
    },
    setError: {
      reducer: (
        state,
        action: PayloadAction<{ field: string; error: string }>
      ) => {
        const { error, field } = action.payload;
        state.errors[field] = error;
      },
      prepare: (field: string, error: string) => {
        return {
          payload: {
            field,
            error,
          },
        };
      },
    },
    setErrors: (state, action: PayloadAction<Dictionary<string>>) => {
      state.errors = action.payload;
    },
    setTouches: (state, action: PayloadAction<Dictionary<boolean>>) => {
      state.touched = action.payload;
    },
  },
  extraReducers: {
    "@form/viewer/setFieldValue": (
      state,
      action: ReturnType<typeof setFieldValue>
    ) => {
      const {
        payload: { fieldId },
      } = action;
      state.touched[fieldId] = true;
    },
  },
});

export default fieldStateSlice.reducer;
export const viewerFieldActions = fieldStateSlice.actions;
