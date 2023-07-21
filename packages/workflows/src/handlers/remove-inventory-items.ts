import { InventoryItemDTO, MedusaContainer } from "@medusajs/types"

import { InputAlias } from "../definitions"
import { WorkflowArguments } from "../helper"

export async function removeInventoryItems({
  container,
  data,
}: WorkflowArguments & {
  data: {
    [InputAlias.InventoryItems]: InventoryItemDTO
  }[]
}) {
  const manager = container.resolve("manager")
  const inventoryService = container.resolve("inventoryService")
  const context = { transactionManager: manager }

  const value = await Promise.all(
    data.map(async ({ [InputAlias.InventoryItems]: inventoryItem }) => {
      return await inventoryService!.deleteInventoryItem(
        inventoryItem.id,
        context
      )
    })
  )

  return {
    alias: InputAlias.RemovedInventoryItems,
    value,
  }
}
