import { isDate } from "@medusajs/utils"

export const transformDate = ({ value }): Date => {
  return !isDate(value) ? new Date(value) : new Date(Number(value) * 1000)
}

export const transformOptionalDate = (input) => {
  return !isDate(input) ? input.value : transformDate(input)
}
