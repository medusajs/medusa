import type { IPricingModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to retrieve the prices of price lists.
 */
export type GetExistingPriceListsPriceIdsStepInput = {
  /**
   * The IDs of the price lists to retrieve the prices for.
   */
  price_list_ids: string[]
}

/**
 * An object whose keys are price list IDs and values are arrays of its price IDs.
 */
export type GetExistingPriceListsPriceIdsStepOutput = Record<string, string[]>

export const getExistingPriceListsPriceIdsStepId =
  "get-existing-price-lists-prices"
/**
 * This step retrieves prices of price lists.
 */
export const getExistingPriceListsPriceIdsStep = createStep(
  getExistingPriceListsPriceIdsStepId,
  async (data: GetExistingPriceListsPriceIdsStepInput, { container }) => {
    const { price_list_ids: priceListIds = [] } = data
    const priceListPriceIdsMap: GetExistingPriceListsPriceIdsStepOutput = {}
    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    const existingPrices = priceListIds.length
      ? await pricingModule.listPrices(
          { price_list_id: priceListIds },
          { relations: ["price_list"] }
        )
      : []

    for (const price of existingPrices) {
      const priceListId = price.price_list!.id
      const prices = priceListPriceIdsMap[priceListId] || []

      priceListPriceIdsMap[priceListId] = prices.concat(price.id)
    }

    return new StepResponse(priceListPriceIdsMap)
  }
)
