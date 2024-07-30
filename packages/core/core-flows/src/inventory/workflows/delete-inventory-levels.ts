import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"

import { deleteInventoryLevelsStep } from "../steps"

interface WorkflowInput {
  ids: string[]
}
export const deleteInventoryLevelsWorkflowId =
  "delete-inventory-levels-workflow"
export const deleteInventoryLevelsWorkflow = createWorkflow(
  deleteInventoryLevelsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<string[]>> => {
    return new WorkflowResponse(deleteInventoryLevelsStep(input.ids))
  }
)
