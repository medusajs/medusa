import {
  CreatePriceDTO,
  CreatePricesDTO,
  FulfillmentWorkflow,
  IPricingModuleService,
  IRegionModuleService,
  PriceDTO,
  PriceSetDTO,
  RemoteQueryFunction,
} from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import {
  ContainerRegistrationKeys,
  isDefined,
  LINKS,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

interface PriceRegionId {
  region_id: string
  amount: number
}

type SetShippingOptionsPricesStepInput = {
  id: string
  prices?: FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput["prices"]
}[]

async function getCurrentShippingOptionPrices(
  shippingOptionIds: string[],
  { remoteQuery }: { remoteQuery: RemoteQueryFunction }
): Promise<
  { shipping_option_id: string; price_set_id: string; prices: PriceDTO[] }[]
> {
  const query = remoteQueryObjectFromString({
    service: LINKS.ShippingOptionPriceSet,
    variables: {
      filters: { shipping_option_id: shippingOptionIds },
      take: null,
    },
    fields: ["shipping_option_id", "price_set_id", "price_set.prices.*"],
  })

  const shippingOptionPrices = (await remoteQuery(query)) as {
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
        },
      }
    }

    return price
  })

  return shippingOptionPrices as CreatePriceDTO[]
}

export const setShippingOptionsPricesStepId = "set-shipping-options-prices-step"
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
        ModuleRegistrationName.REGION
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
      ModuleRegistrationName.PRICING
    )

    for (const data_ of data) {
      const shippingOptionData = shippingOptionPricesMap.get(data_.id)!

      if (!isDefined(shippingOptionData.prices)) {
        continue
      }

      await pricingService.update(shippingOptionData.price_set_id, {
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
      ModuleRegistrationName.PRICING
    )

    for (const data_ of rollbackData) {
      const prices = data_.prices as CreatePricesDTO[]
      if (!isDefined(prices)) {
        continue
      }
      await pricingService.update(data_.price_set_id, { prices })
    }
  }
)
