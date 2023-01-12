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

  return variantInventory.reduce((acc, cur) => {
    const variant = variants.find((v) => v.id === cur.variant_id)

    acc[cur.inventory_item_id] = acc[cur.inventory_item_id] ?? []
    acc[cur.inventory_item_id].push(variant)
    return acc
  }, {})
}
