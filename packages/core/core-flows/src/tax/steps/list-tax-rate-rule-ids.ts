import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { FilterableTaxRateRuleProps, ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

type StepInput = {
  selector: FilterableTaxRateRuleProps
}

export const listTaxRateRuleIdsStepId = "list-tax-rate-rule-ids"
export const listTaxRateRuleIdsStep = createStep(
  listTaxRateRuleIdsStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const rules = await service.listTaxRateRules(input.selector, {
      select: ["id"],
    })
    return new StepResponse(rules.map((r) => r.id))
  }
)
