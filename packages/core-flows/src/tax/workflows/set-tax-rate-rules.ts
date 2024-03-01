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
  taxRateId: string
  rules: Omit<CreateTaxRateRuleDTO, "tax_rate_id">[]
}

const listRulesStep = createStep(
  "set-tax-rate-rules-list-rules",
  async ({ rateId }: { rateId: string }, { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const rules = await service.listTaxRateRules(
      { tax_rate_id: rateId },
      { select: ["id"] }
    )
    return new StepResponse(rules.map((r) => r.id))
  }
)

export const setTaxRateRulesWorkflowId = "set-tax-rate-rules"
export const setTaxRateRulesWorkflow = createWorkflow(
  setTaxRateRulesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<TaxRateRuleDTO[]> => {
    const ruleIds = listRulesStep({ rateId: input.taxRateId })
    deleteTaxRateRulesStep(ruleIds)

    const rulesWithRateId = transform(input, ({ rules, taxRateId }) => {
      return rules.map((r) => ({ ...r, tax_rate_id: taxRateId }))
    })

    return createTaxRateRulesStep(rulesWithRateId)
  }
)
