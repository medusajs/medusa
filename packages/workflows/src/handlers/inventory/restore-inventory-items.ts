import { IInventoryService, InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function restoreInventoryItems({
  container,
  context,
  data,
}: WorkflowArguments<{
  inventoryItems: { inventoryItem: InventoryItemDTO }[]
}>) {
  const { manager } = context
  const inventoryService: IInventoryService =
    container.resolve("inventoryService")

  if (!inventoryService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'removeInventoryItems' will be skipped.`
    )
    return
  }

  // TODO

  // return await inventoryService!.restoreItems(
  //   data.inventoryItems.map(({ inventoryItem }) => inventoryItem.id),
  //   { transactionManager: manager }
  // )
}

restoreInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
