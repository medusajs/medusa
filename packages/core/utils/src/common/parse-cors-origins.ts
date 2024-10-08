import { buildRegexpIfValid } from "./build-regexp-if-valid"

export function parseCorsOrigins(str: string): (string | RegExp)[] {
  return !str
    ? []
    : str.split(",").map((subStr) => {
        return buildRegexpIfValid(subStr) ?? subStr
      })
}
