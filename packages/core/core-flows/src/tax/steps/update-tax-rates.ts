import {
  FilterableTaxRateProps,
  ITaxModuleService,
  UpdateTaxRateDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateTaxRatesStepInput = {
  selector: FilterableTaxRateProps
  update: UpdateTaxRateDTO
}

export const updateTaxRatesStepId = "update-tax-rates"
/**
 * This step updates tax rates matching the specified filters.
 */
export const updateTaxRatesStep = createStep(
  updateTaxRatesStepId,
  async (data: UpdateTaxRatesStepInput, { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listTaxRates(data.selector, {
      select: selects,
      relations,
    })

    const taxRates = await service.updateTaxRates(data.selector, data.update)

    return new StepResponse(taxRates, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.upsertTaxRates(prevData)
  }
)
