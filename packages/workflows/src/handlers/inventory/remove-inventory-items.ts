import { InventoryItemDTO, SharedContext } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function removeInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: { inventoryItem: InventoryItemDTO }[]
}>) {
  const { manager } = context as SharedContext
  const inventoryService = container.resolve("inventoryService")

  if (!inventoryService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'removeInventoryItems' will be skipped.`
    )
    return []
  }

  await inventoryService!.deleteInventoryItem(
    data.inventoryItems.map(({ inventoryItem }) => inventoryItem.id),
    { transactionManager: manager }
  )

  return data.inventoryItems
}

removeInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
