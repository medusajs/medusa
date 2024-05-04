export function isDate(value: any): value is Date {
  return value !== null && !isNaN(new Date(value).valueOf())
}
