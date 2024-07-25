import { isObject } from "./is-object"

/**
 * In most casees, JSON.parse(JSON.stringify(obj)) is enough to deep copy an object.
 * But in some cases, it's not enough. For example, if the object contains a function or a proxy, it will be lost after JSON.parse(JSON.stringify(obj)).
 *
 * @param obj
 */
export function deepCopy<
  T extends Record<any, any> | Record<any, any>[] = Record<any, any>,
  TOutput = T extends [] ? T[] : T
>(obj: T): TOutput {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    const copy: any[] = []
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepCopy(obj[i])
    }
    return copy as TOutput
  }

  if (isObject(obj)) {
    const copy: Record<any, any> = {}
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = deepCopy(obj[attr] as T)
      }
    }
    return copy
  }

  return obj
}
