import {
  CreatePricesDTO,
  FulfillmentWorkflow,
  IPricingModuleService,
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

export const setShippingOptionsPricesStepId = "set-shipping-options-prices-step"
export const setShippingOptionsPricesStep = createStep(
  setShippingOptionsPricesStepId,
  async (data: SetShippingOptionsPricesStepInput, { container }) => {
    if (!data.length) {
      return
    }

    const remoteQuery = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const currentPrices = await getCurrentShippingOptionPrices(
      data.map((d) => d.id),
      { remoteQuery }
    )

    const shippingOptionPricesMap = new Map(
      currentPrices.map((price) => [
        price.shipping_option_id,
        { price_set_id: price.price_set_id, prices: price.prices },
      ])
    )

    const pricingService = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    for (const data_ of data) {
      const prices = data_.prices
      if (!isDefined(prices)) {
        continue
      }

      const price_set_id = shippingOptionPricesMap.get(data_.id)?.price_set_id!
      await pricingService.update(price_set_id, {
        prices: prices as CreatePricesDTO[],
      })
    }

    return new StepResponse(void 0, currentPrices)
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
