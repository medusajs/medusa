import {
  AdminInventoryItem,
  AdminPrice,
  AdminProductImage,
  AdminProductVariant,
} from "@medusajs/types"

export const VARIANT_DETAIL_FIELDS =
  "*inventory_items,*inventory_items.inventory,*inventory_items.inventory.location_levels,*options,*options.option,*prices,*prices.price_rules,+images.id,+images.url,+images.variants.id"

export type ExtendedVariantPrice = AdminPrice & {
  rules?: Record<string, unknown>
}

export type ExtendedVariant = Omit<AdminProductVariant, "images" | "prices"> & {
  // This field is expanded in other parts of the codebase
  inventory?: (AdminInventoryItem & {
    location_levels?: {
      location_id: string
      available_quantity: number | null
      stocked_quantity: number
    }[]
  })[]
  inventory_items?: {
    inventory: AdminInventoryItem
    inventory_item_id: string
    required_quantity: number
  }[]
  prices: ExtendedVariantPrice[]
  images?: (AdminProductImage & {
    variants?: AdminProductVariant[]
  })[]
}
