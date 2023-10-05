import { InventoryTypes, WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export type CreateInventoryItemsPreparedData = {
  inventoryItems: InventoryTypes.InventoryItemDTO[]
}

export async function createInventoryItemsPrepareData({
  container,
  context,
  data,
}: WorkflowArguments<WorkflowTypes.InventoryWorkflow.CreateInventoryItemsWorkflowInputDTO>): Promise<CreateInventoryItemsPreparedData> {
  const inventoryItems = data.inventoryItems
  return {
    inventoryItems: inventoryItems as InventoryTypes.InventoryItemDTO[],
  }
}

createInventoryItemsPrepareData.aliases = {
  payload: "payload",
}
