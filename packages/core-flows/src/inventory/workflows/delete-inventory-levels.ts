import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { deleteLevelsStep } from "../steps"

interface WorkflowInput {
  ids: string[]
}
export const deleteInventoryLevelsWorkflowId =
  "delete-inventory-levels-workflow"
export const deleteInventoryLevelsWorkflow = createWorkflow(
  deleteInventoryLevelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<string[]> => {
    return deleteLevelsStep(input.ids)
  }
)
