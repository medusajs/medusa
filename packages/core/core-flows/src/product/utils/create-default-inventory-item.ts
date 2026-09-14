import { InventoryTypes } from "@medusajs/framework/types"

/**
 * The variant fields that are carried over to its default inventory item.
 */
type VariantInventoryInput = Pick<
  InventoryTypes.CreateInventoryItemInput,
  | "sku"
  | "origin_country"
  | "mid_code"
  | "material"
  | "weight"
  | "length"
  | "height"
  | "width"
  | "hs_code"
> & {
  title?: string | null
}

/**
 * Builds the default inventory item for a variant that manages its inventory
 * without any inventory items of its own. Shared by the create and update
 * paths so both produce the same item.
 */
export const createDefaultInventoryItem = (
  variant: VariantInventoryInput
): InventoryTypes.CreateInventoryItemInput => {
  return {
    sku: variant.sku,
    origin_country: variant.origin_country,
    mid_code: variant.mid_code,
    material: variant.material,
    weight: variant.weight,
    length: variant.length,
    height: variant.height,
    width: variant.width,
    title: variant.title,
    description: variant.title,
    hs_code: variant.hs_code,
    requires_shipping: true,
  }
}
