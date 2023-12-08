import { isString } from "./is-string"

export const isoFormatDate = (date: Date | string) => {
  if (isString(date)) {
    date = new Date(date)
  }
  return date.toISOString()
}
