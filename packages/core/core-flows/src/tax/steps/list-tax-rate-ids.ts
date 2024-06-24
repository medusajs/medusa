import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { FilterableTaxRateProps, ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

type StepInput = {
  selector: FilterableTaxRateProps
}

export const listTaxRateIdsStepId = "list-tax-rate-ids"
export const listTaxRateIdsStep = createStep(
  listTaxRateIdsStepId,
  async (input: StepInput, { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const rates = await service.listTaxRates(input.selector, {
      select: ["id"],
    })

    return new StepResponse(rates.map((r) => r.id))
  }
)
