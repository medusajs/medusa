export function isValidNumber(
  val: number | undefined
): val is number extends undefined ? never : number {
  return typeof val === "number" && !isNaN(val)
}
