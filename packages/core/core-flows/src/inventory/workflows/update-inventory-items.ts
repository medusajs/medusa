import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"

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
  ): WorkflowResponse<InventoryTypes.InventoryItemDTO[]> => {
    return new WorkflowResponse(updateInventoryItemsStep(input.updates))
  }
)
