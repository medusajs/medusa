import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteCollectionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteCollectionsWorkflowId = "delete-collections"
export const deleteCollectionsWorkflow = createWorkflow(
  deleteCollectionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteCollectionsStep(input.ids)
  }
)
