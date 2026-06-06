import type { ITaxModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the tax rate rules to delete.
 */
export type DeleteTaxRateRulesStepInput = string[]

export const deleteTaxRateRulesStepId = "delete-tax-rate-rules"
/**
 * This step deletes one or more tax rate rules.
 */
export const deleteTaxRateRulesStep = createStep(
  deleteTaxRateRulesStepId,
  async (ids: DeleteTaxRateRulesStepInput, { container }) => {
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
