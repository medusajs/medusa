export function isDate(value: any): value is Date {
  const date = new Date(value)
  return !isNaN(date.valueOf())
}
