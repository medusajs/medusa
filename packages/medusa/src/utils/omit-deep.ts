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
