export function isPromise<T, Args extends any[]>(arg: T | Promise<T>): arg is Promise<T> {
  const c = arg instanceof Promise;
  return c;
}
