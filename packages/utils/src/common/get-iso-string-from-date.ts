import { isDate } from "./is-date"
import { MedusaError } from "./errors"

export const GetIsoStringFromDate = (date: Date | string) => {
  if (!isDate(date)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot format date to ISO string: ${date}`
    )
  }

  date = new Date(date)

  return date.toISOString()
}
