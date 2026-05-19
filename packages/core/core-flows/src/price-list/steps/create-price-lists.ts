import {
  CreatePriceListDTO,
  CreatePriceListsWorkflowStepDTO,
  IPricingModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createPriceListsStepId = "create-price-lists"
/**
 * This step creates a price list.
 *
 * @example
 * const data = createPriceListsStep({
 *   data: [{
 *     title: "Test Price List",
 *     description: "Test Price List",
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
export const createPriceListsStep = createStep(
  createPriceListsStepId,
  async (stepInput: CreatePriceListsWorkflowStepDTO, { container }) => {
    const { data, variant_price_map: variantPriceMap } = stepInput

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    if (!data.length) {
      return new StepResponse([])
    }

    const createData = data.map((priceListDTO) => {
      const { prices = [], ...rest } = priceListDTO
      const createPriceListData: CreatePriceListDTO = { ...rest }

      createPriceListData.prices = prices.map((price) => ({
        currency_code: price.currency_code,
        amount: price.amount,
        min_quantity: price.min_quantity,
        max_quantity: price.max_quantity,
        price_set_id: variantPriceMap[price.variant_id],
        rules: price.rules,
      }))

      return createPriceListData
    })

    const createdPriceLists = await pricingModule.createPriceLists(createData)

    return new StepResponse(
      createdPriceLists,
      createdPriceLists.map((createdPriceLists) => createdPriceLists.id)
    )
  },
  async (createdPriceListIds, { container }) => {
    if (!createdPriceListIds?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    await pricingModule.deletePriceLists(createdPriceListIds)
  }
)
