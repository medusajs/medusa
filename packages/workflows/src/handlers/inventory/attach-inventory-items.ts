import { InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function attachInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: {
    tag: string
    inventoryItemId: string
    inventoryItem?: InventoryItemDTO
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
    ({ tag, inventoryItemId, requiredQuantity }) => ({
      variantId: tag,
      inventoryItemId: inventoryItemId,
      requiredQuantity,
    })
  )

  return await productVariantInventoryService.attachInventoryItem(inventoryData)
}

attachInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
