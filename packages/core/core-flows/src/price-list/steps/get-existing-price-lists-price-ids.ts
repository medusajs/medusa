import { IPricingModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const getExistingPriceListsPriceIdsStepId =
  "get-existing-price-lists-prices"
/**
 * This step retrieves prices of price lists.
 */
export const getExistingPriceListsPriceIdsStep = createStep(
  getExistingPriceListsPriceIdsStepId,
  async (data: { price_list_ids: string[] }, { container }) => {
    const { price_list_ids: priceListIds = [] } = data
    const priceListPriceIdsMap: Record<string, string[]> = {}
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
