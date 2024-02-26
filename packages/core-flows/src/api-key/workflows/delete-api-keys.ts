import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteApiKeysStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteApiKeysWorkflowId = "delete-api-keys"
export const deleteApiKeysWorkflow = createWorkflow(
  deleteApiKeysWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteApiKeysStep(input.ids)
  }
)
