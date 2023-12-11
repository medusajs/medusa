import { isDate } from "./is-date"

export const isoFormatDate = (date: Date | string) => {
  if (isDate(date)) {
    date = new Date(date)
  }
  return (date as Date).toISOString()
}
