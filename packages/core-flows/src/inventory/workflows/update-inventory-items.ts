import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { InventoryNext } from "@medusajs/types"
import { updateInventoryItemsStep } from "../steps"

interface WorkflowInput {
  updates: InventoryNext.UpdateInventoryItemInput[]
}
export const updateInventoryItemsWorkflowId = "update-inventory-items-workflow"
export const updateInventoryItemsWorkflow = createWorkflow(
  updateInventoryItemsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<InventoryNext.InventoryItemDTO[]> => {
    return updateInventoryItemsStep(input.updates)
  }
)
