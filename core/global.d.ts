declare global {
  type Dictionary<T> = Record<string, T>;
}

// This export statement is required to make this file a module
// Without it, TypeScript won't recognize the global declarations
export {};
