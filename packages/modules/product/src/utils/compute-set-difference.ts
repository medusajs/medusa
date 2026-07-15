/**
 * Computes the difference between a current set of values and a new set of value IDs.
 * Handles both regular arrays and MikroORM collections.
 *
 * @param currentValues - Current values (array or MikroORM collection with toArray method)
 * @param newValueIds - Array of new value IDs to compare against
 * @returns Object with arrays of value IDs to remove and add
 *
 * @example
 * ```ts
 * const currentValues = [{ id: "1" }, { id: "2" }, { id: "3" }]
 * const newValueIds = ["2", "3", "4"]
 * const diff = computeSetDifference(currentValues, newValueIds)
 * // Result: { toRemove: ["1"], toAdd: ["4"] }
 * ```
 */
export function computeSetDifference(
  currentValues: { id: string }[] | { toArray?(): { id: string }[] } | null,
  newValueIds: string[]
): { toRemove: string[]; toAdd: string[] } {
  const normalized: { id: string }[] = Array.isArray(currentValues)
    ? currentValues
    : (currentValues as any)?.toArray?.() ?? []

  const currentSet = new Set<string>(normalized.map((v) => v.id))
  const newSet = new Set<string>(newValueIds)

  return {
    toRemove: Array.from(currentSet).filter((id) => !newSet.has(id)),
    toAdd: Array.from(newSet).filter((id) => !currentSet.has(id)),
  }
}
