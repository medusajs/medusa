import {
  CreateTaxRateRuleDTO,
  ITaxModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createTaxRateRulesStepId = "create-tax-rate-rules"
/**
 * This step creates one or more tax rate rules.
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
