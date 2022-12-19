import { isDefined } from "medusa-core-utils"

export function removeUndefinedProperties<T extends object>(inputObj: T): T {
  const removeProperties = (obj: T) => {
    const res = {} as T

    Object.keys(obj).reduce((acc: T, key: string) => {
      if (typeof obj[key] === "undefined") {
        return acc
      }
      acc[key] = removeUndefinedDeeply(obj[key])
      return acc
    }, res)

    return res
  }

  return removeProperties(inputObj)
}

function removeUndefinedDeeply(input: unknown): any {
  if (isDefined(input)) {
    if (input === null || input === "null") {
      return null
    } else if (Array.isArray(input)) {
      return input
        .map((item) => {
          return removeUndefinedDeeply(item)
        })
        .filter((v) => isDefined(v))
    } else if (Object.prototype.toString.call(input) === "[object Date]") {
      return input
    } else if (typeof input === "object") {
      return Object.keys(input).reduce(
        (acc: Record<string, unknown>, key: string) => {
          if (typeof input[key] === "undefined") {
            return acc
          }
          acc[key] = removeUndefinedDeeply(input[key])
          return acc
        },
        {}
      )
    } else {
      return input
    }
  }
}
