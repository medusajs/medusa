import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ITaxModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteTaxRateRulesStepId = "delete-tax-rate-rules"
export const deleteTaxRateRulesStep = createStep(
  deleteTaxRateRulesStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    await service.softDeleteTaxRateRules(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    await service.restore(prevIds)
  }
)
