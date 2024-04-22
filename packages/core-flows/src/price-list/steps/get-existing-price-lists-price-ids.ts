import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const getExistingPriceListsPriceIdsStepId =
  "get-existing-price-lists-prices"
export const getExistingPriceListsPriceIdsStep = createStep(
  getExistingPriceListsPriceIdsStepId,
  async (data: { price_list_ids: string[] }, { container }) => {
    const { price_list_ids: priceListIds = [] } = data
    const priceListPriceIdsMap: Record<string, string[]> = {}
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const existingPrices = priceListIds.length
      ? await pricingModule.listPrices(
          { price_list_id: priceListIds },
          { relations: ["price_list"], take: null }
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
