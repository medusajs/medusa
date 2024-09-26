import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"

import { InventoryTypes } from "@medusajs/framework/types"
import { updateInventoryItemsStep } from "../steps"

export interface UpdateInventoryItemsWorkflowInput {
  updates: InventoryTypes.UpdateInventoryItemInput[]
}
export const updateInventoryItemsWorkflowId = "update-inventory-items-workflow"
/**
 * This workflow updates one or more inventory items.
 */
export const updateInventoryItemsWorkflow = createWorkflow(
  updateInventoryItemsWorkflowId,
  (
    input: WorkflowData<UpdateInventoryItemsWorkflowInput>
  ): WorkflowResponse<InventoryTypes.InventoryItemDTO[]> => {
    return new WorkflowResponse(updateInventoryItemsStep(input.updates))
  }
)
