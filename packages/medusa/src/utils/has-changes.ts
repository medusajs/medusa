import { isObject } from "./is-object"

/**
 * Compare two objects and return true if there is changes detected from obj2 compared to obj1
 * @param obj1
 * @param obj2
 */
export function hasChanges<T1 extends Object, T2 extends Object>(
  obj1: T1,
  obj2: T2
): boolean {
  for (const [key, value] of Object.entries(obj2)) {
    if (isObject(obj1[key])) {
      return hasChanges(obj1[key], value)
    }

    if (obj1[key] !== value) {
      return true
    }
  }

  return false
}
