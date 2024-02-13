import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteUsersStep } from "../steps"

interface WorkflowInput {
  ids: string[]
}

export const deleteUsersWorkflowId = "delete-user"
export const deleteUsersWorkflow = createWorkflow(
  "delete-user",
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteUsersStep(input.ids)
  }
)
