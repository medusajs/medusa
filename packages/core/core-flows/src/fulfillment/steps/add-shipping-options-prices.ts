import {
  CreatePriceSetDTO,
  IPricingModuleService,
  IRegionModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface ShippingOptionsPriceCurrencyCode {
  currency_code: string
  amount: number
}

interface ShippingOptionsPriceRegionId {
  region_id: string
  amount: number
}

export type CreateShippingOptionsPriceSetsStepInput = {
  id: string
  prices: (ShippingOptionsPriceCurrencyCode | ShippingOptionsPriceRegionId)[]
}[]

function buildPriceSet(
  prices: CreateShippingOptionsPriceSetsStepInput[0]["prices"],
  regionToCurrencyMap: Map<string, string>
): CreatePriceSetDTO {
  const shippingOptionPrices = prices.map((price) => {
    if ("currency_code" in price) {
      return {
        currency_code: price.currency_code,
        amount: price.amount,
      }
    }

    return {
      currency_code: regionToCurrencyMap.get(price.region_id)!,
      amount: price.amount,
      rules: {
        region_id: price.region_id,
      },
    }
  })

  return { prices: shippingOptionPrices }
}

export const createShippingOptionsPriceSetsStepId =
  "add-shipping-options-prices-step"
/**
 * This step creates price sets for one or more shipping options.
 */
export const createShippingOptionsPriceSetsStep = createStep(
  createShippingOptionsPriceSetsStepId,
  async (data: CreateShippingOptionsPriceSetsStepInput, { container }) => {
    if (!data?.length) {
      return new StepResponse([], [])
    }

    const regionIds = data
      .map((input) => input.prices)
      .flat()
      .filter((price): price is ShippingOptionsPriceRegionId => {
        return "region_id" in price
      })
      .map((price) => price.region_id)

    let regionToCurrencyMap: Map<string, string> = new Map()

    if (regionIds.length) {
      const regionService = container.resolve<IRegionModuleService>(
        Modules.REGION
      )
      const regions = await regionService.listRegions(
        {
          id: [...new Set(regionIds)],
        },
        {
          select: ["id", "currency_code"],
        }
      )

      regionToCurrencyMap = new Map(
        regions.map((region) => [region.id, region.currency_code])
      )
    }

    const priceSetsData = data.map((input) =>
      buildPriceSet(input.prices, regionToCurrencyMap)
    )

    const pricingService = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    const priceSets = await pricingService.createPriceSets(priceSetsData)

    const shippingOptionPriceSetLinData = data.map((input, index) => {
      return {
        id: input.id,
        priceSetId: priceSets[index].id,
      }
    })

    return new StepResponse(
      shippingOptionPriceSetLinData,
      priceSets.map((priceSet) => priceSet.id)
    )
  },
  async (priceSetIds, { container }) => {
    if (!priceSetIds?.length) {
      return
    }

    const pricingService = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    await pricingService.deletePriceSets(priceSetIds)
  }
)
