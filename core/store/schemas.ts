import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { EditorStore } from "../schema/types.ts";

export type AppDispatch = ThunkDispatch<EditorStore, void, any>;

export type ValueOf<T> = T[keyof T];
export type ActionTypes<T extends Record<string, any>> = Extract<
  ReturnType<ValueOf<T>>,
  Action
>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  EditorStore,
  unknown,
  Action<string>
>;
