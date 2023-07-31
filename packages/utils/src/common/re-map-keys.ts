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
