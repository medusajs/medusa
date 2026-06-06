import {
  CreatePriceDTO,
  CreatePriceSetPriceRules,
  CreatePricesDTO,
  FulfillmentWorkflow,
  IPricingModuleService,
  IRegionModuleService,
  PriceDTO,
  PriceSetDTO,
  RemoteQueryFunction,
} from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  LINKS,
  Modules,
  isDefined,
  isString,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

interface PriceRegionId {
  region_id: string
  amount: number
}

/**
 * The data to set the prices of a shipping option.
 */
export type SetShippingOptionsPricesStepInput = {
  /**
   * The ID of the shipping option.
   */
  id: string
  /**
   * The prices of the shipping option.
   */
  prices?: FulfillmentWorkflow.UpdateShippingOptionPriceRecord[]
}[]

async function getCurrentShippingOptionPrices(
  shippingOptionIds: string[],
  { remoteQuery }: { remoteQuery: RemoteQueryFunction }
): Promise<
  { shipping_option_id: string; price_set_id: string; prices: PriceDTO[] }[]
> {
  const shippingOptionPrices = (await remoteQuery({
    service: LINKS.ShippingOptionPriceSet,
    variables: {
      filters: { shipping_option_id: shippingOptionIds },
    },
    fields: ["shipping_option_id", "price_set_id", "price_set.prices.*"],
  } as any)) as {
    shipping_option_id: string
    price_set_id: string
    price_set: PriceSetDTO
  }[]

  return shippingOptionPrices.map((shippingOption) => {
    const prices = shippingOption.price_set?.prices ?? []
    const price_set_id = shippingOption.price_set_id
    return {
      shipping_option_id: shippingOption.shipping_option_id,
      price_set_id,
      prices,
    }
  })
}

function buildPrices(
  prices: SetShippingOptionsPricesStepInput[0]["prices"],
  regionToCurrencyMap: Map<string, string>
): CreatePriceDTO[] {
  if (!prices) {
    return []
  }

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

    if ("region_id" in price) {
      const currency_code = regionToCurrencyMap.get(price.region_id!)!
      const regionId = price.region_id
      delete price.region_id
      return {
        ...price,
        currency_code: currency_code,
        amount: price.amount,
        rules: {
          region_id: regionId,
          ...additionalRules,
        },
      }
    }

    if ("currency_code" in price) {
      return {
        ...price,
        amount: price.amount,
        rules: {
          ...additionalRules,
        },
      }
    }

    return price
  })

  return shippingOptionPrices as CreatePriceDTO[]
}

export const setShippingOptionsPricesStepId = "set-shipping-options-prices-step"
/**
 * This step sets the prices of one or more shipping options.
 * 
 * @example
 * const data = setShippingOptionsPricesStep([
 *   {
 *     id: "so_123",
 *     prices: [
 *       {
 *         amount: 1000,
 *         currency_code: "usd",
 *       }
 *     ]
 *   }
 * ])
 */
export const setShippingOptionsPricesStep = createStep(
  setShippingOptionsPricesStepId,
  async (data: SetShippingOptionsPricesStepInput, { container }) => {
    if (!data.length) {
      return
    }

    const regionIds = data
      .map((input) => input.prices)
      .flat()
      .filter((price): price is PriceRegionId => "region_id" in (price ?? {}))
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

    const remoteQuery = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const currentShippingOptionPricesData =
      await getCurrentShippingOptionPrices(
        data.map((d) => d.id),
        { remoteQuery }
      )

    const shippingOptionPricesMap = new Map(
      currentShippingOptionPricesData.map((currentShippingOptionDataItem) => {
        const shippingOptionData = data.find(
          (d) => d.id === currentShippingOptionDataItem.shipping_option_id
        )!
        const pricesData = shippingOptionData?.prices?.map((priceData) => {
          return {
            ...priceData,
            price_set_id: currentShippingOptionDataItem.price_set_id,
          }
        })

        const buildPricesData =
          pricesData && buildPrices(pricesData, regionToCurrencyMap)

        return [
          currentShippingOptionDataItem.shipping_option_id,
          {
            price_set_id: currentShippingOptionDataItem.price_set_id,
            prices: buildPricesData,
          },
        ]
      })
    )

    const pricingService = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    for (const data_ of data) {
      const shippingOptionData = shippingOptionPricesMap.get(data_.id)!

      if (!isDefined(shippingOptionData.prices)) {
        continue
      }

      await pricingService.updatePriceSets(shippingOptionData.price_set_id, {
        prices: shippingOptionData.prices,
      })
    }

    return new StepResponse(void 0, currentShippingOptionPricesData)
  },
  async (rollbackData, { container }) => {
    if (!rollbackData?.length) {
      return
    }

    const pricingService = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    for (const data_ of rollbackData) {
      const prices = data_.prices as CreatePricesDTO[]
      if (!isDefined(prices)) {
        continue
      }
      await pricingService.updatePriceSets(data_.price_set_id, { prices })
    }
  }
)
