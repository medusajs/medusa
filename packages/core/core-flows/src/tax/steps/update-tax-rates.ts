import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableTaxRateProps,
  ITaxModuleService,
  UpdateTaxRateDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateTaxRatesStepInput = {
  selector: FilterableTaxRateProps
  update: UpdateTaxRateDTO
}

export const updateTaxRatesStepId = "update-tax-rates"
export const updateTaxRatesStep = createStep(
  updateTaxRatesStepId,
  async (data: UpdateTaxRatesStepInput, { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.list(data.selector, {
      select: selects,
      relations,
    })

    const taxRates = await service.update(data.selector, data.update)

    return new StepResponse(taxRates, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    await service.upsert(prevData)
  }
)
