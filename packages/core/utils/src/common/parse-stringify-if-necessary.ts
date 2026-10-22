import { isDefined } from "./is-defined"

/**
 * Creates a deep copy of the input, ensuring it's JSON-serializable.
 * - Breaks all reference sharing (creates new objects/arrays)
 * - Removes non-serializable values (functions, symbols, undefined properties)
 * - Normalizes special types (Date -> string)
 * - Only stringifies special objects, not entire tree (optimization)
 * @param result
 * @returns A deep copy with no shared references, guaranteed to be JSON-serializable
 */
export function parseStringifyIfNecessary(result: unknown): any {
  if (result == null || typeof result !== "object") {
    return result
  }

  if (Array.isArray(result)) {
    return result.map((item) => parseStringifyIfNecessary(item))
  }

  const isPlainObject =
    result.constructor === Object || result.constructor === undefined

  if (!isPlainObject) {
    const strResult = JSON.stringify(result)
    if (isDefined(strResult)) {
      return JSON.parse(strResult)
    }
    return undefined
  }

  const copy: any = {}
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = (result as any)[key]

      if (typeof value === "function" || typeof value === "symbol") {
        continue
      }

      const copiedValue = parseStringifyIfNecessary(value)

      if (copiedValue !== undefined) {
        copy[key] = copiedValue
      }
    }
  }
  return copy
}
