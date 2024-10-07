import { isObject } from "./is-object"
import * as util from "node:util"

/**
 * In most casees, JSON.parse(JSON.stringify(obj)) is enough to deep copy an object.
 * But in some cases, it's not enough. For example, if the object contains a function or a proxy, it will be lost after JSON.parse(JSON.stringify(obj)).
 *
 * @param obj
 * @param cache
 */
export function deepCopy<
  T extends Record<any, any> | Record<any, any>[] = Record<any, any>,
  TOutput = T extends [] ? T[] : T
>(obj: T, cache = new WeakMap()): TOutput {
  if (obj === null || typeof obj !== "object") {
    return obj as TOutput
  }

  // Handle circular references with cache
  if (cache.has(obj)) {
    return cache.get(obj) as TOutput
  }

  let copy: TOutput

  // Handle arrays
  if (Array.isArray(obj)) {
    copy = [] as unknown as TOutput
    cache.set(obj, copy) // Add to cache before recursing
    ;(obj as Array<any>).forEach((item, index) => {
      ;(copy as Array<any>)[index] = deepCopy(item, cache)
    })
    return copy
  }

  // Handle objects
  if (isObject(obj)) {
    if (util.types.isProxy(obj)) {
      return obj as unknown as TOutput
    }

    copy = {} as TOutput
    cache.set(obj, copy) // Add to cache before recursing

    Object.keys(obj).forEach((key) => {
      ;(copy as Record<any, any>)[key] = deepCopy(
        (obj as Record<any, any>)[key],
        cache
      )
    })

    return copy
  }

  return obj as TOutput
}
