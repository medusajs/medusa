import { castNumber } from "./cast-number"

export function parseOptionalFormValue<T>(value: T): T | undefined {
  if (typeof value === "string" && value.trim() === "") {
    return undefined
  }

  if (Array.isArray(value) && value.length === 0) {
    return undefined
  }

  return value
}

export function parseOptionalFormNumber(value?: string | number) {
  if (typeof value === "undefined" || value === "") {
    return undefined
  }

  if (typeof value === "string") {
    return castNumber(value)
  }

  return value
}
