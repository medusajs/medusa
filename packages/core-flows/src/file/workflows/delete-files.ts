import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteFilesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteFilesWorkflowId = "delete-files"
export const deleteFilesWorkflow = createWorkflow(
  deleteFilesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    deleteFilesStep(input.ids)
  }
)
