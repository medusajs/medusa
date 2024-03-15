import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const removePriceListPricesStepId = "remove-price-list-prices"
export const removePriceListPricesStep = createStep(
  removePriceListPricesStepId,
  async (ids: string[], { container }) => {
    if (!ids.length) {
      return new StepResponse(null, [])
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const psmas = await pricingModule.listPriceSetMoneyAmounts(
      { id: ids },
      { relations: ["price_list"] }
    )

    await pricingModule.removePrices(psmas.map((psma) => psma.id))

    return new StepResponse(
      null,
      psmas.map((psma) => psma.id)
    )
  },
  async (ids, { container }) => {
    if (!ids) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    // TODO: This needs to be implemented
    // pricingModule.restorePrices(ids)
  }
)
