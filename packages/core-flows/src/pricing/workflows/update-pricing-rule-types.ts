import { RuleTypeDTO, UpdateRuleTypeDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updatePricingRuleTypesStep } from "../steps"

type WorkflowInput = { data: UpdateRuleTypeDTO[] }

export const updatePricingRuleTypesWorkflowId = "update-pricing-rule-types"
export const updatePricingRuleTypesWorkflow = createWorkflow(
  updatePricingRuleTypesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<RuleTypeDTO[]> => {
    return updatePricingRuleTypesStep(input.data)
  }
)
