import {
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../../services"
import { InventoryItemDTO } from "../../../../../types/inventory"
import { ProductVariant } from "../../../../../models"

export const getVariantsByInventoryItemId = async (
  inventoryItems: InventoryItemDTO[],
  productVariantInventoryService: ProductVariantInventoryService,
  productVariantService: ProductVariantService
) => {
  const variantInventory = await productVariantInventoryService.listByItem(
    inventoryItems.map((item) => item.id)
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
    id: variantInventory.map((varInventory) => varInventory.variant_id),
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
  inventoryItems: InventoryItemDTO[],
  productVariantInventoryService: ProductVariantInventoryService,
  productVariantService: ProductVariantService
) => {
  const variantsByInventoryItemId = await getVariantsByInventoryItemId(
    inventoryItems,
    productVariantInventoryService,
    productVariantService
  )

  const responseItems = inventoryItems.map((item) => {
    const responseItem: ResponseInventoryItem = { ...item }
    responseItem.variant = variantsByInventoryItemId[item.id] || {}
    return responseItem
  })
  return responseItems
}

type ResponseInventoryItem = Partial<InventoryItemDTO> & {
  variant?: ProductVariant
}
