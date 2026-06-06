import {
  FilterableTaxRateProps,
  ITaxModuleService,
  UpdateTaxRateDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update tax rates.
 */
export type UpdateTaxRatesStepInput = {
  /**
   * The filters to select the tax rates to update.
   */
  selector: FilterableTaxRateProps
  /**
   * The data to update in the tax rates.
   */
  update: UpdateTaxRateDTO
}

export const updateTaxRatesStepId = "update-tax-rates"
/**
 * This step updates tax rates matching the specified filters.
 * 
 * @example
 * const data = updateTaxRatesStep({
 *   selector: {
 *     id: "txr_123"
 *   },
 *   update: {
 *     name: "Default Tax Rate",
 *   }
 * })
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
