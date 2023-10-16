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
  }[]
}>) {
  const { manager } = context
  const productVariantInventoryService = container
    .resolve("productVariantInventoryService")
    .withTransaction(manager)

  if (!data?.inventoryItems?.length) {
    return
  }

  const inventoryData = data.inventoryItems.map(({ tag, inventoryItem }) => ({
    variantId: tag,
    inventoryItemId: inventoryItem.id,
  }))

  return await productVariantInventoryService.attachInventoryItem(inventoryData)
}

attachInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
