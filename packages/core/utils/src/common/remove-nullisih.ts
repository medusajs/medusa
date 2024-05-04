import { isDefined } from "./is-defined"

export function removeNullish<T = unknown>(
  obj: Record<string, T>
): Record<string, T> {
  return Object.entries(obj).reduce(
    (resultObject, [currentKey, currentValue]) => {
      if (!isDefined(currentValue) || currentValue === null) {
        return resultObject
      }

      resultObject[currentKey] = currentValue

      return resultObject
    },
    {}
  )
}
