import type {
  CreateTaxRateDTO,
  ITaxModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createTaxRatesStepId = "create-tax-rates"
/**
 * This step creates one or more tax rates.
 *
 * @example
 * const data = createTaxRatesStep([
 *   {
 *     name: "Default",
 *     tax_region_id: "txreg_123",
 *   }
 * ])
 */
export const createTaxRatesStep = createStep(
  createTaxRatesStepId,
  async (data: CreateTaxRateDTO[], { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)

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

    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.deleteTaxRates(createdIds)
  }
)
