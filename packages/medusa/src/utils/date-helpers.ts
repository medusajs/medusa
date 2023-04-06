import { isDate } from "lodash"

export const isPast = (date: Date | null) => {
  const now = new Date()
  return isDate(date) && now > date
}

export const isFuture = (date: Date | null) => {
  const now = new Date()
  return isDate(date) && date > now
}
