import { InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function attachInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: {
    tag: string
    inventoryItem: InventoryItemDTO
    requiredQuantity?: number
  }[]
}>) {
  let productVariantInventoryService = container.resolve(
    "productVariantInventoryService"
  )

  if (context && context.manager) {
    productVariantInventoryService =
      productVariantInventoryService.withTransaction(context.manager)
  }

  if (!data?.inventoryItems?.length) {
    return
  }

  const inventoryData = data.inventoryItems.map(
    ({ tag, inventoryItem, requiredQuantity }) => ({
      variantId: tag,
      inventoryItemId: inventoryItem.id,
      requiredQuantity,
    })
  )

  return await productVariantInventoryService.attachInventoryItem(inventoryData)
}

attachInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
