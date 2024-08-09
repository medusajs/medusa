import { FilterableTaxRateProps, ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

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
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const rates = await service.listTaxRates(input.selector, {
      select: ["id"],
    })

    return new StepResponse(rates.map((r) => r.id))
  }
)
