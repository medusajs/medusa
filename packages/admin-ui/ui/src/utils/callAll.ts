export const callAll = (...fns: Function[]) => (...args) =>
  fns?.forEach(async fn => typeof fn === "function" &&  fn(...args))
