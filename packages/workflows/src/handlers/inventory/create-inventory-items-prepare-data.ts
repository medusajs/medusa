import { WorkflowTypes } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export type CreateInventoryItemsPreparedData =
  WorkflowTypes.InventoryWorkflow.CreateInventoryItemsWorkflowInputDTO

export async function createInventoryItemsPrepareData({
  data,
}: WorkflowArguments<WorkflowTypes.InventoryWorkflow.CreateInventoryItemsWorkflowInputDTO>): Promise<CreateInventoryItemsPreparedData> {
  const inventoryItems = data.inventoryItems
  return {
    inventoryItems: inventoryItems,
  }
}

createInventoryItemsPrepareData.aliases = {
  payload: "payload",
}
