import { InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

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
    return []
  }

  const inventoryData = data.inventoryItems.map(({ tag, inventoryItem }) => ({
    variantId: tag,
    inventoryItemId: inventoryItem.id,
  }))

  await productVariantInventoryService.attachInventoryItem(inventoryData)

  return data.inventoryItems
}

attachInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
