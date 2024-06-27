export function isBoolean(val: any): val is boolean {
  return val != null && typeof val === "boolean"
}
