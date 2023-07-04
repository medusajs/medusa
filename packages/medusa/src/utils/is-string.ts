export function isString(val: any): val is string {
  return val != null && typeof val === "string"
}
