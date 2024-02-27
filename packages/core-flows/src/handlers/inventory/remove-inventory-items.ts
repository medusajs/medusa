import { InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

export async function removeInventoryItems({
  container,
  data,
}: WorkflowArguments<{
  inventoryItems: { inventoryItem: InventoryItemDTO }[]
}>) {
  const inventoryService = container.resolve("inventoryService")

  if (!inventoryService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'removeInventoryItems' will be skipped.`
    )
    return []
  }

  await inventoryService!.deleteInventoryItem(
    data.inventoryItems.map(({ inventoryItem }) => inventoryItem.id)
  )

  return data.inventoryItems
}

removeInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
