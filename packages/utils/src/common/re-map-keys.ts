/**
 * Re map the keys to another value depending on the provided remapMap.
 * If the key is not in the remapMap, the key will be kept.
 *
 * @param object
 * @param remapMap
 */
export function reMapKeys<T extends Record<any, any>>(
  object: T,
  remapMap: Map<string, string>
): T {
  const newObject: Record<string, any> = {}

  for (const key in object) {
    if (remapMap.has(key)) {
      newObject[remapMap.get(key)!] = object[key]
    } else {
      newObject[key] = object[key]
    }
  }

  return newObject as T
}
