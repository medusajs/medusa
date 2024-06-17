import { CreateRuleTypeDTO, RuleTypeDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createPricingRuleTypesStep } from "../steps"

type WorkflowInput = { data: CreateRuleTypeDTO[] }

export const createPricingRuleTypesWorkflowId = "create-pricing-rule-types"
export const createPricingRuleTypesWorkflow = createWorkflow(
  createPricingRuleTypesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<RuleTypeDTO[]> => {
    return createPricingRuleTypesStep(input.data)
  }
)
