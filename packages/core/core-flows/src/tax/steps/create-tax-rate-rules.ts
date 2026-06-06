import {
  CreateTaxRateRuleDTO,
  ITaxModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createTaxRateRulesStepId = "create-tax-rate-rules"
/**
 * This step creates one or more tax rate rules.
 * 
 * @example
 * const data = createTaxRateRulesStep([
 *   {
 *     reference: "product_type",
 *     reference_id: "ptyp_123",
 *     tax_rate_id: "txr_123"
 *   }
 * ])
 */
export const createTaxRateRulesStep = createStep(
  createTaxRateRulesStepId,
  async (data: CreateTaxRateRuleDTO[], { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    const created = await service.createTaxRateRules(data)

    return new StepResponse(
      created,
      created.map((rule) => rule.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.deleteTaxRateRules(createdIds)
  }
)
