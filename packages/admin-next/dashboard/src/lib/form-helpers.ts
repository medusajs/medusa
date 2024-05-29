import { castNumber } from "./cast-number"

export function parseOptionalFormValue<T>(
  value: T,
  nullify = true
): T | undefined | null {
  if (typeof value === "string" && value.trim() === "") {
    return nullify ? null : undefined
  }

  if (Array.isArray(value) && value.length === 0) {
    return nullify ? null : undefined
  }

  return value
}

type Nullable<T> = { [K in keyof T]: T[K] | null }

export function parseOptionalFormData<T extends Record<string, unknown>>(
  data: T,
  nullify = true
): Nullable<T> {
  return Object.entries(data).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: parseOptionalFormValue(value, nullify),
    }
  }, {} as Nullable<T>)
}

export function parseOptionalFormNumber(
  value?: string | number,
  nullify = true
) {
  if (
    typeof value === "undefined" ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return nullify ? null : undefined
  }

  if (typeof value === "string") {
    return castNumber(value)
  }

  return value
}
