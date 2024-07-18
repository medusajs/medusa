import { CreateTaxRateDTO, ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createTaxRatesStepId = "create-tax-rates"
export const createTaxRatesStep = createStep(
  createTaxRatesStepId,
  async (data: CreateTaxRateDTO[], { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const created = await service.createTaxRates(data)

    return new StepResponse(
      created,
      created.map((rate) => rate.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    await service.deleteTaxRates(createdIds)
  }
)
