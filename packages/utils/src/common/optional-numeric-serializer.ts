import { isDefined } from "./is-defined"

export const optionalNumericSerializer = (value) =>
  isDefined(value) && value !== null ? Number(value) : value
