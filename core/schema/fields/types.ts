export type StdFieldLayout = "horizontal" | "vertical";

export type KeyboardType =
  | "default"
  | "number-pad"
  | "decimal-pad"
  | "numeric"
  | "email-address"
  | "phone-pad"
  | "url";
export type KeyboardTypeIOS =
  | "ascii-capable"
  | "numbers-and-punctuation"
  | "name-phone-pad"
  | "twitter"
  | "web-search";
export type KeyboardTypeAndroid = "visible-password";
export type KeyboardTypeOptions =
  | KeyboardType
  | KeyboardTypeAndroid
  | KeyboardTypeIOS;
