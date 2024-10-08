import { castNumber } from "./cast-number"

export function transformNullableFormValue<T>(
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
type Optional<T> = { [K in keyof T]: T[K] | undefined }

export function transformNullableFormData<
  T extends Record<string, unknown>,
  K extends boolean = true
>(data: T, nullify: K = true as K): K extends true ? Nullable<T> : Optional<T> {
  return Object.entries(data).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: transformNullableFormValue(value, nullify),
    }
  }, {} as K extends true ? Nullable<T> : Optional<T>)
}

export function transformNullableFormNumber<K extends boolean = true>(
  value?: string | number,
  nullify: K = true as K
): K extends true ? number | null : number | undefined {
  if (
    typeof value === "undefined" ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return (nullify ? null : undefined) as K extends true
      ? number | null
      : number | undefined
  }

  if (typeof value === "string") {
    return castNumber(value)
  }

  return value
}

type NullableNumbers = Record<string, number | null>
type OptionalNumbers = Record<string, number | undefined>

export function transformNullableFormNumbers<
  T extends Record<string, string | number | undefined>,
  K extends boolean = true
>(
  data: T,
  nullify: K = true as K
): K extends true ? NullableNumbers : OptionalNumbers {
  return Object.entries(data).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: transformNullableFormNumber(value, nullify),
    }
  }, {} as K extends true ? NullableNumbers : OptionalNumbers)
}
