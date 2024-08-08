import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"

import { deleteInventoryLevelsStep } from "../steps"

export interface DeleteInventoryLevelsWorkflowInput {
  ids: string[]
}
export const deleteInventoryLevelsWorkflowId =
  "delete-inventory-levels-workflow"
/**
 * This workflow deletes one or more inventory levels.
 */
export const deleteInventoryLevelsWorkflow = createWorkflow(
  deleteInventoryLevelsWorkflowId,
  (input: WorkflowData<DeleteInventoryLevelsWorkflowInput>): WorkflowResponse<string[]> => {
    return new WorkflowResponse(deleteInventoryLevelsStep(input.ids))
  }
)
