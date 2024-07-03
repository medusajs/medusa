import { ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const deleteTaxRatesStepId = "delete-tax-rates"
export const deleteTaxRatesStep = createStep(
  deleteTaxRatesStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    await service.softDeleteTaxRates(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    await service.restoreTaxRates(prevIds)
  }
)
