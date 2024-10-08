import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteTaxRateRulesStep } from "../steps"

export type DeleteTaxRateRulesWorkflowInput = { ids: string[] }

export const deleteTaxRateRulesWorkflowId = "delete-tax-rate-rules"
/**
 * This workflow deletes one or more tax rate rules.
 */
export const deleteTaxRateRulesWorkflow = createWorkflow(
  deleteTaxRateRulesWorkflowId,
  (
    input: WorkflowData<DeleteTaxRateRulesWorkflowInput>
  ): WorkflowResponse<void> => {
    return new WorkflowResponse(deleteTaxRateRulesStep(input.ids))
  }
)
