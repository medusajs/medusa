import { isValidRegex } from "./is-valid-regexp";

export function parseCorsOrigins(str: string): (string | RegExp)[] {
  return str.split(",").map((subStr) => {
    return isValidRegex(subStr) ? new RegExp(subStr) : subStr
  })
}
