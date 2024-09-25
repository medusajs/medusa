import { ITaxModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteTaxRateRulesStepId = "delete-tax-rate-rules"
/**
 * This step deletes one or more tax rate rules.
 */
export const deleteTaxRateRulesStep = createStep(
  deleteTaxRateRulesStepId,
  async (ids: string[], { container }) => {
    if (!ids?.length) {
      return new StepResponse(void 0, [])
    }

    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.softDeleteTaxRateRules(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.restoreTaxRateRules(prevIds)
  }
)
