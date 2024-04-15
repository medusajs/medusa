import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const removePriceListPricesStepId = "remove-price-list-prices"
export const removePriceListPricesStep = createStep(
  removePriceListPricesStepId,
  async (ids: string[], { container }) => {
    if (!ids.length) {
      return new StepResponse(
        {
          ids: [],
          object: "price",
          deleted: true,
        },
        []
      )
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const prices = await pricingModule.listPrices(
      { id: ids },
      { relations: ["price_list"] }
    )

    const priceIds = prices.map((price) => price.id)

    await pricingModule.softDeletePrices(priceIds)

    return new StepResponse(
      {
        ids: priceIds,
        object: "price",
        deleted: true,
      },
      priceIds
    )
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await pricingModule.restorePrices(ids)
  }
)
