export function isDate(value: any): value is Date {
  return !isNaN(new Date(value).valueOf())
}
