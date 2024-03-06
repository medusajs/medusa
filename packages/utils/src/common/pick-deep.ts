import { isObject } from "./is-object"

export function pickDeep<T extends object = object>(
  input: object,
  fields: Array<number | string>,
  prefix: string = ""
): T {
  if (!input) {
    return input
  }

  return Object.entries(input).reduce((nextInput, [key, value]) => {
    const fieldMatches = fields.includes(withPrefix(key, prefix))
    const valueIsObject = isObject(value)
    const valueIsArray = Array.isArray(value)
    const valueIsNotObjectOrArray = !(
      valueIsArray ||
      (valueIsObject && Object.keys(value).length)
    )

    if (fieldMatches && (valueIsObject || valueIsArray)) {
      nextInput[key] = value

      return nextInput
    }

    if (!fieldMatches && valueIsNotObjectOrArray) {
      return nextInput
    }

    if (valueIsArray) {
      nextInput[key] = value.map((arrItem) => {
        if (isObject(arrItem)) {
          return pickDeep(arrItem, fields, withPrefix(key, prefix))
        }
        return arrItem
      })

      return nextInput
    } else if (valueIsObject) {
      nextInput[key] = pickDeep(value, fields, withPrefix(key, prefix))
      return nextInput
    }

    nextInput[key] = value

    return nextInput
  }, {} as T)
}

function withPrefix(key: string, prefix: string): string {
  if (prefix.length) {
    return `${prefix}.${key}`
  } else {
    return key
  }
}
