import {
  FilterableTaxRateProps,
  ITaxModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type ListTaxRateIdsStepInput = {
  selector: FilterableTaxRateProps
}

export const listTaxRateIdsStepId = "list-tax-rate-ids"
/**
 * This step retrieves the IDs of tax rates matching the specified filters.
 */
export const listTaxRateIdsStep = createStep(
  listTaxRateIdsStepId,
  async (input: ListTaxRateIdsStepInput, { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    const rates = await service.listTaxRates(input.selector, {
      select: ["id"],
    })

    return new StepResponse(rates.map((r) => r.id))
  }
)
