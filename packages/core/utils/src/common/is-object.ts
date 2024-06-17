export function isObject(obj: any): obj is object {
  return obj != null && obj?.constructor?.name === "Object"
}
