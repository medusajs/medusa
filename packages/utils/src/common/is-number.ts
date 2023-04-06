export function isNumber(val: any): val is number {
  return val !== null && typeof val === "number"
}
