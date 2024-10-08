import { IPricingModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const removePriceListPricesStepId = "remove-price-list-prices"
/**
 * This step removes prices from a price list.
 */
export const removePriceListPricesStep = createStep(
  removePriceListPricesStepId,
  async (ids: string[], { container }) => {
    if (!ids.length) {
      return new StepResponse([], [])
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    const prices = await pricingModule.listPrices(
      { id: ids },
      { relations: ["price_list"] }
    )

    const priceIds = prices.map((price) => price.id)

    await pricingModule.softDeletePrices(priceIds)

    return new StepResponse(priceIds, priceIds)
  },
  async (ids, { container }) => {
    if (!ids?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    await pricingModule.restorePrices(ids)
  }
)
