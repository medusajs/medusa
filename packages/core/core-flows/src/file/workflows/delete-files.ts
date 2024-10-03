import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteFilesStep } from "../steps"

export type DeleteFilesWorkflowInput = { ids: string[] }

export const deleteFilesWorkflowId = "delete-files"
/**
 * This workflow deletes one or more files.
 */
export const deleteFilesWorkflow = createWorkflow(
  deleteFilesWorkflowId,
  (input: WorkflowData<DeleteFilesWorkflowInput>): WorkflowData<void> => {
    deleteFilesStep(input.ids)
  }
)
