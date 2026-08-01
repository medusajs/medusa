import { deepKeysFromList } from "deeks"

const productExportKeyOptions = {
  arrayIndexesAsKeys: true,
  expandNestedObjects: true,
  expandArrayObjects: true,
  ignoreEmptyArraysWhenExpanding: true,
  escapeNestedDots: true,
}

export const appendProductExportKeys = (
  normalizedProducts: object[],
  keys: string[],
  seenKeys: Set<string>
) => {
  const productKeys = deepKeysFromList(
    normalizedProducts,
    productExportKeyOptions
  )
  for (const key of productKeys.flat()) {
    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      keys.push(key)
    }
  }
}
