import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteRegionsStep } from "../steps"

export type DeleteRegionsWorkflowInput = { ids: string[] }

export const deleteRegionsWorkflowId = "delete-regions"
/**
 * This workflow deletes one or more regions.
 */
export const deleteRegionsWorkflow = createWorkflow(
  deleteRegionsWorkflowId,
  (input: WorkflowData<DeleteRegionsWorkflowInput>): WorkflowData<void> => {
    return deleteRegionsStep(input.ids)
  }
)
