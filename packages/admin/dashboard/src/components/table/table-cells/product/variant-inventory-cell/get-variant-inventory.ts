import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"

export type VariantInventory = Pick<
  HttpTypes.AdminProductVariant,
  "manage_inventory" | "inventory_quantity" | "inventory_items"
>

export const getVariantInventory = (
  variant: VariantInventory,
  t: TFunction
) => {
  if (!variant.manage_inventory) {
    return {
      text: t("products.variant.inventory.notManaged"),
      hasInventoryKit: false,
      quantity: undefined,
      notManaged: true,
    }
  }

  const quantity = variant.inventory_quantity

  const inventoryItems = (variant.inventory_items
    ?.map((i) => i.inventory)
    .filter(Boolean) ?? []) as HttpTypes.AdminInventoryItem[]

  const hasInventoryKit = inventoryItems.length > 1

  const locations: Record<string, boolean> = {}

  inventoryItems.forEach((i) => {
    i.location_levels?.forEach((l) => {
      locations[l.id] = true
    })
  })

  const locationCount = Object.keys(locations).length

  const text = hasInventoryKit
    ? t("products.variant.tableItemAvailable", {
        availableCount: quantity,
      })
    : t("products.variant.tableItem", {
        availableCount: quantity,
        locationCount,
        count: locationCount,
      })

  return { text, hasInventoryKit, quantity, notManaged: false }
}
