import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteRegionsStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteRegionsWorkflowId = "delete-regions"
export const deleteRegionsWorkflow = createWorkflow(
  deleteRegionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteRegionsStep(input.ids)
  }
)
