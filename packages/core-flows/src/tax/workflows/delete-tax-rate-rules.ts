import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteTaxRateRulesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteTaxRateRulesWorkflowId = "delete-tax-rate-rules"
export const deleteTaxRateRulesWorkflow = createWorkflow(
  deleteTaxRateRulesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    return deleteTaxRateRulesStep(input.ids)
  }
)
