/**
 * Return true if the value is truthy and otherwise false
 * @param val
 */
export function isTruthy(val: string | boolean | undefined): boolean {
  if (typeof val === "string") {
    return val.toLowerCase() === "true"
  }
  return !!val
}
