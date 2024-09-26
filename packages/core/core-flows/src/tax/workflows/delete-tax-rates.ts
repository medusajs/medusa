import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteTaxRatesStep } from "../steps"

export type DeleteTaxRatesWorkflowInput = { ids: string[] }

export const deleteTaxRatesWorkflowId = "delete-tax-rates"
/**
 * This workflow deletes one or more tax rates.
 */
export const deleteTaxRatesWorkflow = createWorkflow(
  deleteTaxRatesWorkflowId,
  (
    input: WorkflowData<DeleteTaxRatesWorkflowInput>
  ): WorkflowResponse<void> => {
    return new WorkflowResponse(deleteTaxRatesStep(input.ids))
  }
)
