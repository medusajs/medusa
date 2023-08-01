type RemapInputObject = Record<any, Record<string, any>[]>
type RemapConfig = { newKey: string; getter: (object: any) => string }
export type RemapKeyAndPickMap = Map<string, RemapConfig[]>

/**
 * Create a new object with the keys remapped and the values picked from the original object based
 * on the map config
 *
 * @param object
 * @param remapMap
 * @param removeIfNotRemapped
 */
export function reMapKeysAndPick<T extends RemapInputObject>(
  object: T,
  remapMap: RemapKeyAndPickMap,
  removeIfNotRemapped = false
): T {
  const newObject: Record<string, any> = {}

  for (const key in object) {
    const remapConfig = remapMap.get(key)!

    if (!remapConfig) {
      if (!removeIfNotRemapped) {
        newObject[key] = object[key]
      }
      continue
    }

    remapConfig.forEach((config) => {
      newObject[config.newKey] = object[key].map(config.getter).filter(Boolean)
    })
  }

  return newObject as T
}
