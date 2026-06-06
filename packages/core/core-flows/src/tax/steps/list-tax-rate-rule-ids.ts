import {
  FilterableTaxRateRuleProps,
  ITaxModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to retrieve the tax rate rule IDs.
 */
export type ListTaxRateRuleIdsStepInput = {
  /**
   * The filters to select the tax rate rules.
   */
  selector: FilterableTaxRateRuleProps
}

export const listTaxRateRuleIdsStepId = "list-tax-rate-rule-ids"
/**
 * This step retrieves the IDs of tax rate rules matching the specified filters.
 * 
 * @example
 * const data = listTaxRateRuleIdsStep({
 *   selector: {
 *     tax_rate_id: "txr_123"
 *   }
 * })
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
