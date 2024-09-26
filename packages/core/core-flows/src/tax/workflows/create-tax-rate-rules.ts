import { CreateTaxRateRuleDTO, TaxRateRuleDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createTaxRateRulesStep } from "../steps"

export type CreateTaxRateRulesWorkflowInput = {
  rules: CreateTaxRateRuleDTO[]
}

export const createTaxRateRulesWorkflowId = "create-tax-rate-rules"
/**
 * This workflow creates one or more tax rate rules.
 */
export const createTaxRateRulesWorkflow = createWorkflow(
  createTaxRateRulesWorkflowId,
  (
    input: WorkflowData<CreateTaxRateRulesWorkflowInput>
  ): WorkflowResponse<TaxRateRuleDTO[]> => {
    return new WorkflowResponse(createTaxRateRulesStep(input.rules))
  }
)
