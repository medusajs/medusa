import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteTaxRegionsStep } from "../steps"

export type DeleteTaxRegionsWorkflowInput = { ids: string[] }

export const deleteTaxRegionsWorkflowId = "delete-tax-regions"
/**
 * This workflow deletes one or more tax regions.
 */
export const deleteTaxRegionsWorkflow = createWorkflow(
  deleteTaxRegionsWorkflowId,
  (
    input: WorkflowData<DeleteTaxRegionsWorkflowInput>
  ): WorkflowResponse<void> => {
    return new WorkflowResponse(deleteTaxRegionsStep(input.ids))
  }
)
