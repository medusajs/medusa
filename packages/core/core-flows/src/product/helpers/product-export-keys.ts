import { deepKeysFromList } from "deeks"

/**
 * Collects all deep keys from a list of normalized product objects and adds them
 * to the provided set. This is used to build a consistent set of CSV column keys
 * before exporting products.
 *
 * @since 2.19.1
 *
 * @example
 * const seenKeys = new Set<string>()
 * appendProductExportKeys(normalizedProducts, seenKeys, { arrayIndexesAsKeys: true })
 */
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
