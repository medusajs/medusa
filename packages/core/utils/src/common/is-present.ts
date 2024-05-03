import { isDefined } from "./is-defined"
import { isObject } from "./is-object"
import { isString } from "./is-string"

export function isPresent(value: any): boolean {
  if (!isDefined(value) || value === null) {
    return false
  }

  if (isString(value) || Array.isArray(value)) {
    return value.length > 0
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size > 0
  }

  if (isObject(value)) {
    return Object.keys(value).length > 0
  }

  return true
}
