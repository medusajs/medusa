export function isObject(obj: unknown): obj is object {
  return typeof obj === "object" && !!obj
}
