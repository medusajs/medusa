import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../../services"
import { InventoryItemDTO } from "../../../../../types/inventory"
import { ProductVariant } from "../../../../../models"

export type InventoryItemsWithVariants = Partial<InventoryItemDTO> & {
  variants?: ProductVariant[]
}

export const getVariantsByInventoryItemId = async (
  inventoryItems: InventoryItemDTO[],
  productVariantInventoryService: ProductVariantInventoryService,
  productVariantService: ProductVariantService
): Promise<Record<string, InventoryItemsWithVariants>> => {
  const variantInventory = await productVariantInventoryService.listByItem(
    inventoryItems.map((item) => item.id)
  )

  const variants = await productVariantService.list({
    id: variantInventory.map((varInventory) => varInventory.variant_id),
  })
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]))

  return variantInventory.reduce((acc, cur) => {
    acc[cur.inventory_item_id] = acc[cur.inventory_item_id] ?? []
    acc[cur.inventory_item_id].push(variantMap.get(cur.variant_id))
    return acc
  }, {})
}
