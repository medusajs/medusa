import { RemoteLink } from "@medusajs/framework/modules-sdk"
import { RemoteQueryFunction } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import {
  ContainerRegistrationKeys,
  LINKS,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"

export type SetShippingOptionsPriceSetsStepInput = {
  id: string
  price_sets?: string[]
}[]

interface FilteredSetShippingOptionsPriceSetsStepInput {
  id: string
  price_sets: string[]
}

type LinkItems = {
  [Modules.FULFILLMENT]: { shipping_option_id: string }
  [Modules.PRICING]: { price_set_id: string }
}[]

async function getCurrentShippingOptionPriceSetsLinks(
  shippingOptionIds: string[],
  { remoteQuery }: { remoteQuery: RemoteQueryFunction }
): Promise<LinkItems> {
  const shippingOptionPriceSetLinks = (await remoteQuery({
    service: LINKS.ShippingOptionPriceSet,
    variables: {
      filters: { shipping_option_id: shippingOptionIds },
    },
    fields: ["shipping_option_id", "price_set_id"],
  } as any)) as {
    shipping_option_id: string
    price_set_id: string
  }[]

  return shippingOptionPriceSetLinks.map((shippingOption) => {
    return {
      [Modules.FULFILLMENT]: {
        shipping_option_id: shippingOption.shipping_option_id,
      },
      [Modules.PRICING]: {
        price_set_id: shippingOption.price_set_id,
      },
    }
  })
}

export const setShippingOptionsPriceSetsStepId =
  "set-shipping-options-price-sets-step"
/**
 * This step sets the price sets of one or more shipping options.
 */
export const setShippingOptionsPriceSetsStep = createStep(
  setShippingOptionsPriceSetsStepId,
  async (data: SetShippingOptionsPriceSetsStepInput, { container }) => {
    if (!data.length) {
      return
    }

    const dataInputToProcess = data.filter((inputData) => {
      return inputData.price_sets?.length
    }) as FilteredSetShippingOptionsPriceSetsStepInput[]

    if (!dataInputToProcess.length) {
      return
    }

    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    const remoteQuery = container.resolve<RemoteQueryFunction>(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const shippingOptionIds = dataInputToProcess.map(
      (inputData) => inputData.id
    )
    const currentExistingLinks = await getCurrentShippingOptionPriceSetsLinks(
      shippingOptionIds,
      { remoteQuery }
    )

    const linksToRemove: LinkItems = currentExistingLinks
      .filter((existingLink) => {
        return !dataInputToProcess.some((input) => {
          return (
            input.id === existingLink[Modules.FULFILLMENT].shipping_option_id &&
            input.price_sets.includes(
              existingLink[Modules.PRICING].price_set_id
            )
          )
        })
      })
      .map((link) => {
        return {
          [Modules.FULFILLMENT]: {
            shipping_option_id: link[Modules.FULFILLMENT].shipping_option_id,
          },
          [Modules.PRICING]: {
            price_set_id: link[Modules.PRICING].price_set_id,
          },
        }
      })

    const linksToCreate = dataInputToProcess
      .map((inputData) => {
        return inputData.price_sets.map((priceSet) => {
          const alreadyExists = currentExistingLinks.some((link) => {
            return (
              link[Modules.FULFILLMENT].shipping_option_id === inputData.id &&
              link[Modules.PRICING].price_set_id === priceSet
            )
          })

          if (alreadyExists) {
            return
          }

          return {
            [Modules.FULFILLMENT]: { shipping_option_id: inputData.id },
            [Modules.PRICING]: { price_set_id: priceSet },
          }
        })
      })
      .flat()
      .filter((d): d is LinkItems[0] => !!d)

    const promises: Promise<unknown[]>[] = []

    if (linksToRemove.length) {
      promises.push(remoteLink.dismiss(linksToRemove))
    }

    if (linksToCreate.length) {
      promises.push(remoteLink.create(linksToCreate))
    }

    await promiseAll(promises)

    return new StepResponse(void 0, {
      linksToCreate: linksToRemove,
      linksToRemove: linksToCreate,
    })
  },
  async (rollbackData, { container }) => {
    if (!rollbackData) {
      return
    }

    const remoteLink = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    const promises: Promise<unknown[]>[] = []

    if (rollbackData.linksToRemove.length) {
      promises.push(remoteLink.dismiss(rollbackData.linksToRemove))
    }

    if (rollbackData.linksToCreate.length) {
      promises.push(remoteLink.create(rollbackData.linksToCreate))
    }

    await promiseAll(promises)
  }
)
