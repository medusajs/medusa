import { InventoryItemDTO } from "@medusajs/types"

import { InputAlias } from "../definitions"
import { PipelineHandlerResult, WorkflowArguments } from "../helper"

export async function removeInventoryItems<T = void[]>({
  container,
  data,
}: WorkflowArguments & {
  data: {
    [InputAlias.InventoryItems]: InventoryItemDTO
  }[]
}): Promise<PipelineHandlerResult<T>> {
  const manager = container.resolve("manager")
  const inventoryService = container.resolve("inventoryService")
  const context = { transactionManager: manager }

  return (await Promise.all(
    data.map(async ({ [InputAlias.InventoryItems]: inventoryItem }) => {
      return await inventoryService!.deleteInventoryItem(
        inventoryItem.id,
        context
      )
    })
  )) as PipelineHandlerResult<T>
}
