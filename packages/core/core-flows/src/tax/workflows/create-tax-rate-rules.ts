import { CreateTaxRateRuleDTO, TaxRateRuleDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createTaxRateRulesStep } from "../steps"

type WorkflowInput = {
  rules: CreateTaxRateRuleDTO[]
}

export const createTaxRateRulesWorkflowId = "create-tax-rate-rules"
export const createTaxRateRulesWorkflow = createWorkflow(
  createTaxRateRulesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<TaxRateRuleDTO[]> => {
    return createTaxRateRulesStep(input.rules)
  }
)
