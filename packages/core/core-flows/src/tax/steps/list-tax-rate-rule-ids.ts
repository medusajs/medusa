import {
  FilterableTaxRateRuleProps,
  ITaxModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type ListTaxRateRuleIdsStepInput = {
  selector: FilterableTaxRateRuleProps
}

export const listTaxRateRuleIdsStepId = "list-tax-rate-rule-ids"
/**
 * This step retrieves the IDs of tax rate rules matching the specified filters.
 */
export const listTaxRateRuleIdsStep = createStep(
  listTaxRateRuleIdsStepId,
  async (input: ListTaxRateRuleIdsStepInput, { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    const rules = await service.listTaxRateRules(input.selector, {
      select: ["id"],
    })
    return new StepResponse(rules.map((r) => r.id))
  }
)
