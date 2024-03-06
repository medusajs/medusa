import { isObject } from "./is-object"

export function omitDeep<T extends object = object>(
  input: object,
  excludes: Array<number | string>
): T {
  if (!input) {
    return input
  }

  return Object.entries(input).reduce((nextInput, [key, value]) => {
    const shouldExclude = excludes.includes(key)
    if (shouldExclude) {
      return nextInput
    }

    if (Array.isArray(value)) {
      nextInput[key] = value.map((arrItem) => {
        if (isObject(arrItem)) {
          return omitDeep(arrItem, excludes)
        }
        return arrItem
      })
      return nextInput
    } else if (isObject(value)) {
      nextInput[key] = omitDeep(value, excludes)
      return nextInput
    }

    nextInput[key] = value

    return nextInput
  }, {} as T)
}

export function pickDeep<T extends object = object>(
  input: object,
  fields: Array<number | string>,
  prefix: string = ""
): T {
  if (!input) {
    return input
  }

  return Object.entries(input).reduce((nextInput, [key, value]) => {
    const valueIsNotObjectOrArray = !(
      Array.isArray(value) ||
      (isObject(value) && Object.keys(value).length)
    )

    if (!fields.includes(withPrefix(key, prefix)) && valueIsNotObjectOrArray) {
      return nextInput
    }

    if (Array.isArray(value)) {
      nextInput[key] = value.map((arrItem) => {
        if (isObject(arrItem)) {
          return pickDeep(arrItem, fields, withPrefix(key, prefix))
        }
        return arrItem
      })

      return nextInput
    } else if (isObject(value)) {
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
