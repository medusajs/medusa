import type { IPricingModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The IDs of prices to remove.
 */
export type RemovePriceListPricesStepInput = string[]

export const removePriceListPricesStepId = "remove-price-list-prices"
/**
 * This step removes prices.
 */
export const removePriceListPricesStep = createStep(
  removePriceListPricesStepId,
  async (ids: RemovePriceListPricesStepInput, { container }) => {
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
