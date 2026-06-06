import {
  AddPriceListPricesDTO,
  CreatePriceListPriceDTO,
  CreatePriceListPriceWorkflowDTO,
  CreatePriceListPricesWorkflowStepDTO,
  IPricingModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createPriceListPricesStepId = "create-price-list-prices"
/**
 * This step creates prices for a price list.
 *
 * @example
 * const data = createPriceListPricesStep({
 *   data: [{
 *     id: "plist_123",
 *     prices: [
 *       {
 *         currency_code: "USD",
 *         amount: 1000,
 *         variant_id: "variant_123",
 *       }
 *     ]
 *   }],
 *   variant_price_map: {
 *     "variant_123": "pset_123"
 *   }
 * })
 */
export const createPriceListPricesStep = createStep(
  createPriceListPricesStepId,
  async (stepInput: CreatePriceListPricesWorkflowStepDTO, { container }) => {
    const { data, variant_price_map: variantPriceSetMap } = stepInput
    const priceListPricesToCreate: AddPriceListPricesDTO[] = []
    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    for (const createPriceListPricesData of data) {
      const { prices = [], id } = createPriceListPricesData
      const pricesToAdd: CreatePriceListPriceDTO[] = []

      for (const price of prices) {
        const toPush = {
          ...price,
          price_set_id: variantPriceSetMap[price.variant_id!],
        } as CreatePriceListPriceDTO
        delete (toPush as Partial<CreatePriceListPriceWorkflowDTO>).variant_id
        pricesToAdd.push(toPush)
      }

      if (pricesToAdd.length) {
        priceListPricesToCreate.push({
          price_list_id: id,
          prices: pricesToAdd,
        })
      }
    }

    if (!priceListPricesToCreate.length) {
      return new StepResponse([])
    }

    const createdPrices = await pricingModule.addPriceListPrices(
      priceListPricesToCreate
    )

    return new StepResponse(
      createdPrices,
      createdPrices.map((p) => p.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    if (createdIds.length) {
      await pricingModule.removePrices(createdIds)
    }
  }
)
