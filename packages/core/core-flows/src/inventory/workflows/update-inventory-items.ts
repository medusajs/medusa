import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { InventoryTypes } from "@medusajs/types"
import { updateInventoryItemsStep } from "../steps"

interface WorkflowInput {
  updates: InventoryTypes.UpdateInventoryItemInput[]
}
export const updateInventoryItemsWorkflowId = "update-inventory-items-workflow"
export const updateInventoryItemsWorkflow = createWorkflow(
  updateInventoryItemsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<InventoryTypes.InventoryItemDTO[]> => {
    return updateInventoryItemsStep(input.updates)
  }
)
