import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../../services"
import { InventoryItemDTO } from "../../../../../types/inventory"
import { ProductVariant } from "../../../../../models"

export const getVariantsByItemId = async (
  items: InventoryItemDTO[],
  productVariantInventoryService: ProductVariantInventoryService,
  productVariantService: ProductVariantService
) => {
  const variantInventory = await productVariantInventoryService.listByItem(
    items.map((i) => i.id)
  )

  const inventoryVariantMap = variantInventory.reduce((acc, curr) => {
    // We only allow one variant per inventory item for now
    // in the future this should be expanded to handle an array of variants
    if (!acc[curr.variant_id]) {
      acc[curr.variant_id] = curr.inventory_item_id
    }
    return acc
  }, {})

  const variants = await productVariantService.list({
    id: variantInventory.map((i) => i.variant_id),
  })

  return variants.reduce((acc, curr) => {
    const inventoryItem = inventoryVariantMap[curr.id]
    if (!acc[inventoryItem]) {
      acc[inventoryItem] = curr
    }
    return acc
  }, {})
}

export const joinVariants = async (
  items: InventoryItemDTO[],
  productVariantInventoryService: ProductVariantInventoryService,
  productVariantService: ProductVariantService
) => {
  const variantsByItemId = await getVariantsByItemId(
    items,
    productVariantInventoryService,
    productVariantService
  )

  const responseItems = items.map((i) => {
    const responseItem: ResponseInventoryItem = { ...i }
    responseItem.variant = variantsByItemId[i.id] || {}
    return responseItem
  })
  return responseItems
}

type ResponseInventoryItem = Partial<InventoryItemDTO> & {
  variant?: ProductVariant
}
