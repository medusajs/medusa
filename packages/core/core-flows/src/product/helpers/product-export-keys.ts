import { deepKeysFromList } from "deeks"

export const appendProductExportKeys = (
  normalizedProducts: object[],
  seenKeys: Set<string>,
  options: Record<string, any> = {}
) => {
  const productKeys = deepKeysFromList(
    normalizedProducts,
    options
  )
  for (const key of productKeys.flat()) {
    seenKeys.add(key)
  }
}
