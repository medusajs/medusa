import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IPricingModuleService,
  PriceDTO,
  UpdatePriceListPriceDTO,
  UpdatePriceListPricesDTO,
  UpdatePriceListPriceWorkflowStepDTO,
} from "@medusajs/types"
import { buildPriceSetPricesForModule } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const updatePriceListPricesStepId = "update-price-list-prices"
export const updatePriceListPricesStep = createStep(
  updatePriceListPricesStepId,
  async (stepInput: UpdatePriceListPriceWorkflowStepDTO, { container }) => {
    const { data = [], variant_price_map: variantPriceSetMap } = stepInput
    const priceListPricesToUpdate: UpdatePriceListPricesDTO[] = []
    const priceIds: string[] = []
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    for (const priceListData of data) {
      const pricesToUpdate: UpdatePriceListPriceDTO[] = []
      const { prices = [], id } = priceListData

      for (const price of prices) {
        pricesToUpdate.push({
          ...price,
          price_set_id: variantPriceSetMap[price.variant_id!],
        })

        if (price.id) {
          priceIds.push(price.id)
        }
      }

      priceListPricesToUpdate.push({
        price_list_id: id,
        prices: pricesToUpdate,
      })
    }

    const existingPrices = priceIds.length
      ? await pricingModule.listPrices(
          { id: priceIds },
          { relations: ["price_list"] }
        )
      : []

    const priceListPricesMap = new Map<string, PriceDTO[]>()
    const dataBeforePriceUpdate: UpdatePriceListPricesDTO[] = []

    for (const price of existingPrices) {
      const priceListId = price.price_list!.id
      const prices = priceListPricesMap.get(priceListId) || []

      priceListPricesMap.set(priceListId, prices)
    }

    for (const [priceListId, prices] of Object.entries(priceListPricesMap)) {
      dataBeforePriceUpdate.push({
        price_list_id: priceListId,
        prices: buildPriceSetPricesForModule(prices),
      })
    }

    const updatedPrices = await pricingModule.updatePriceListPrices(
      priceListPricesToUpdate
    )

    return new StepResponse(updatedPrices, dataBeforePriceUpdate)
  },
  async (dataBeforePriceUpdate, { container }) => {
    if (!dataBeforePriceUpdate?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    if (dataBeforePriceUpdate.length) {
      await pricingModule.updatePriceListPrices(dataBeforePriceUpdate)
    }
  }
)
