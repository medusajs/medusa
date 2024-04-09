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
  LINKS,
  Modules,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

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
    fields: ["shipping_option_id", "price_set_id", "*price_set.prices"],
  })

  const shippingOptionPriceSetLinks = (await remoteQuery(query)) as {
    shipping_option_id: string
    price_set_id: string
    price_set: PriceSetDTO[]
  }[]

  return shippingOptionPriceSetLinks.map((shippingOption) => {
    const prices = shippingOption.price_set?.[0].prices ?? []
    return {
      shipping_option_id: shippingOption.shipping_option_id,
      price_set_id: shippingOption.price_set_id,
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
      Modules.PRICING
    )

    for (const data_ of data) {
      const prices = (data_.prices?.filter((price) => {
        return price && "id" in price
      }) ?? []) as unknown as CreatePricesDTO[]
      const price_set_id = shippingOptionPricesMap.get(data_.id)?.price_set_id!
      await pricingService.update(price_set_id, { prices })
    }

    return new StepResponse(void 0, currentPrices)
  },
  async (rollbackData, { container }) => {
    if (!rollbackData?.length) {
      return
    }

    const pricingService = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    for (const data_ of rollbackData) {
      const prices = (data_.prices?.filter((price) => {
        return price && "id" in price
      }) ?? []) as unknown as CreatePricesDTO[]
      await pricingService.update(data_.price_set_id, { prices })
    }
  }
)
