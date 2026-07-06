import {
  AdminOrderLineItem,
  AdminProductVariant,
  AdminProductVariantInventoryItemLink,
} from "@medusajs/types"

/**
 * Check if the line item has inventory kit.
 */
export function checkInventoryKit(
  item: AdminOrderLineItem & {
    variant?: AdminProductVariant & {
      inventory_items: AdminProductVariantInventoryItemLink[]
    }
  }
) {
  const variant = item.variant

  if (!variant) {
    return false
  }

  return (
    (!!variant.inventory_items.length && variant.inventory_items.length > 1) ||
    (variant.inventory_items.length === 1 &&
      variant.inventory_items[0].required_quantity! > 1)
  )
}
