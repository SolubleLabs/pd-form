import { Builder } from "../types.ts";
import { std } from "./std.ts";
import type { KeyboardTypeOptions } from "./types.ts";

/**
 * similar to TextInput field but wrapped with std field
 * so that it can be set required
 * @param t
 * @returns
 */
export default function stdTextInputField(t: Builder) {
  return t.append(
    std({
      type: "TextInput",
      initialParams: {
        placeholder: "",
        keyboardType: undefined as KeyboardTypeOptions | undefined,
      },
      initialValue: "" as string | undefined,
      paramReducers: {
        setPlaceholder: (p, placeholder: string) => {
          p.placeholder = placeholder;
        },
        setKeyboardType: (
          p,
          keyboardType: KeyboardTypeOptions | undefined = undefined
        ) => {
          p.keyboardType = keyboardType;
        },
      },
    })
  );
}
