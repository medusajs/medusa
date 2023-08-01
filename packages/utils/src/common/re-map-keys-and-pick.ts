type RemapInputObject = Record<string, unknown[]>
type RemapConfig = { newKey: string; getter: (object: any) => string }
export type RemapKeyAndPickMap<TKeys = string> = Map<TKeys, RemapConfig[]>

/**
 * Create a new object with the keys remapped and the values picked from the original object based
 * on the map config
 *
 * @param object
 * @param remapMap
 * @param removeIfNotRemapped
 */
export function reMapKeysAndPick<
  TResult = any,
  T extends RemapInputObject = RemapInputObject
>(
  object: T,
  remapMap: RemapKeyAndPickMap,
  removeIfNotRemapped = false
): TResult {
  const newObject: Record<string, any> = {}

  for (const key in object) {
    const remapConfig = remapMap.get(key as string)!

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

  return newObject as TResult
}
