import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { deletePricingRuleTypesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deletePricingRuleTypesWorkflowId = "delete-pricing-rule-types"
export const deletePricingRuleTypesWorkflow = createWorkflow(
  deletePricingRuleTypesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    deletePricingRuleTypesStep(input.ids)
  }
)
