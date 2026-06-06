import {
  CreatePriceSetDTO,
  CreatePriceSetPriceRules,
  IPricingModuleService,
  IRegionModuleService,
  PriceRule,
} from "@zjedene-medusa/framework/types"
import { isString, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create price sets for a currency code.
 */
export interface ShippingOptionsPriceCurrencyCode {
  /**
   * The currency code of the price.
   * 
   * @example
   * usd
   */
  currency_code: string
  /**
   * The amount of the price.
   */
  amount: number
  /**
   * The rules of the price.
   */
  rules?: PriceRule[]
}

/**
 * The data to create price sets for a region ID.
 */
interface ShippingOptionsPriceRegionId {
  /**
   * The ID of the region that this price applies in.
   */
  region_id: string
  /**
   * The amount of the price.
   */
  amount: number
  /**
   * The rules of the price.
   */
  rules?: PriceRule[]
}

/**
 * The data to create price sets for shipping options.
 */
export type CreateShippingOptionsPriceSetsStepInput = {
  /**
   * The ID of the shipping option.
   */
  id: string
  /**
   * The prices to create for the shipping option.
   */
  prices: (ShippingOptionsPriceCurrencyCode | ShippingOptionsPriceRegionId)[]
}[]

/**
 * The result of creating price sets for shipping options.
 */
export type CreateShippingOptionsPriceSetsStepOutput = {
  /**
   * The ID of the shipping option.
   */
  id: string
  /**
   * The ID of the price set.
   */
  priceSetId: string
}[]

export function buildPriceSet(
  prices: CreateShippingOptionsPriceSetsStepInput[0]["prices"],
  regionToCurrencyMap: Map<string, string>
): CreatePriceSetDTO {
  const shippingOptionPrices = prices.map((price) => {
    const { rules = [] } = price
    const additionalRules: CreatePriceSetPriceRules = {}

    for (const rule of rules) {
      let existingPriceRules = additionalRules[rule.attribute]

      if (isString(existingPriceRules)) {
        continue
      }

      existingPriceRules ||= []

      existingPriceRules.push({
        operator: rule.operator,
        value: rule.value,
      })

      additionalRules[rule.attribute] = existingPriceRules
    }

    if ("currency_code" in price) {
      return {
        currency_code: price.currency_code,
        amount: price.amount,
        rules: additionalRules,
      }
    }

    return {
      currency_code: regionToCurrencyMap.get(price.region_id)!,
      amount: price.amount,
      rules: {
        region_id: price.region_id,
        ...additionalRules,
      },
    }
  })

  return { prices: shippingOptionPrices }
}

export const createShippingOptionsPriceSetsStepId =
  "add-shipping-options-prices-step"
/**
 * This step creates price sets for one or more shipping options.
 * 
 * :::note
 * 
 * Learn more about adding rules to the shipping option's prices in the Pricing Module's 
 * [Price Rules](https://docs.medusajs.com/resources/commerce-modules/pricing/price-rules) documentation.
 * 
 * :::
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
    }) as CreateShippingOptionsPriceSetsStepOutput

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
