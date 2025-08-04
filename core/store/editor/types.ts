export interface EditorState {
  selectedFieldId: string | null;
  actionMenu: Record<string, ExposedAction>;
}

export const initialState: EditorState = {
  selectedFieldId: null,
  actionMenu: {},
};

export type ExposedAction = {
  name: string;
  icon?: any;
  callback: () => void;
};
