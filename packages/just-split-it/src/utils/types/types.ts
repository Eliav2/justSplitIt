export type RequiresOneOf<T, K extends keyof T = keyof T> = K extends any
  ? Partial<Pick<T, K>> & Required<Pick<T, Exclude<keyof T, K>>>
  : never;
