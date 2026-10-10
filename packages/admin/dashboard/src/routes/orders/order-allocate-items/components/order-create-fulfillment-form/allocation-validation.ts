import type { ExtendedLineItem } from "./order-allocate-items-form"

/**
 * Validate every inventory quantity, including kit components and items hidden
 * by the search filter. Kit root fields contain line item units and are skipped.
 * Empty fields are handled separately by the form's unallocated-items check.
 */
export function getInvalidAllocationKeys(
  items: ExtendedLineItem[],
  locationId: string,
  quantities: Record<string, string | number>
) {
  if (!locationId) {
    return []
  }

  const invalidKeys: string[] = []

  for (const item of items) {
    for (const inventoryItem of item.variant?.inventory ?? []) {
      const key = `${item.id}-${inventoryItem.id}`
      const value = quantities[key]

      if (value === undefined || value === "") {
        continue
      }

      const quantity = Number(value)
      const location = inventoryItem.location_levels?.find(
        (level) => level.location_id === locationId
      )
      const availableQuantity = Math.max(0, location?.available_quantity ?? 0)

      if (
        !Number.isFinite(quantity) ||
        quantity < 0 ||
        quantity > availableQuantity
      ) {
        invalidKeys.push(key)
      }
    }
  }

  return invalidKeys
}
