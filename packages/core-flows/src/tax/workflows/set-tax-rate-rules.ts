import {
  CreateTaxRateRuleDTO,
  ITaxModuleService,
  TaxRateRuleDTO,
} from "@medusajs/types"
import {
  StepResponse,
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createTaxRateRulesStep, deleteTaxRateRulesStep } from "../steps"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

type WorkflowInput = {
  tax_rate_id: string
  rules: Omit<CreateTaxRateRuleDTO, "tax_rate_id">[]
}

const listRuleIdsStep = createStep(
  "set-tax-rate-rules-list-rules",
  async ({ rate_id }: { rate_id: string }, { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const rules = await service.listTaxRateRules(
      { tax_rate_id: rate_id },
      { select: ["id"] }
    )
    return new StepResponse(rules.map((r) => r.id))
  }
)

export const setTaxRateRulesWorkflowId = "set-tax-rate-rules"
export const setTaxRateRulesWorkflow = createWorkflow(
  setTaxRateRulesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<TaxRateRuleDTO[]> => {
    const ruleIds = listRuleIdsStep({ rate_id: input.tax_rate_id })
    deleteTaxRateRulesStep(ruleIds)

    const rulesWithRateId = transform(input, ({ rules, tax_rate_id }) => {
      return rules.map((r) => ({ ...r, tax_rate_id }))
    })

    return createTaxRateRulesStep(rulesWithRateId)
  }
)
