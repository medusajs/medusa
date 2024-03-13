import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, PricingContext } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  arrayDifference,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  optionIds: string[]
  context?: Record<string, unknown>
}

export const getShippingOptionPriceSetsStepId = "get-shipping-option-price-sets"
export const getShippingOptionPriceSetsStep = createStep(
  getShippingOptionPriceSetsStepId,
  async (data: StepInput, { container }) => {
    if (!data.optionIds.length) {
      return new StepResponse({})
    }

    const pricingModuleService = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const query = remoteQueryObjectFromString({
      entryPoint: "shipping_option_price_set",
      fields: ["id", "shipping_option_id", "price_set_id"],
      variables: {
        shipping_option_id: data.optionIds,
      },
    })

    const optionPriceSets = await remoteQuery(query)

    const optionsMissingPrices = arrayDifference(
      data.optionIds,
      optionPriceSets.map((v) => v.shipping_option_id)
    )

    if (optionsMissingPrices.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Shipping options with IDs ${optionsMissingPrices.join(
          ", "
        )} do not have a price`
      )
    }

    const calculatedPriceSets = await pricingModuleService.calculatePrices(
      { id: optionPriceSets.map((v) => v.price_set_id) },
      { context: data.context as PricingContext["context"] }
    )

    const idToPriceSet = new Map<string, Record<string, any>>(
      calculatedPriceSets.map((p) => [p.id, p])
    )

    const optionToCalculatedPriceSets = optionPriceSets.reduce(
      (acc, { shipping_option_id, price_set_id }) => {
        const calculatedPriceSet = idToPriceSet.get(price_set_id)
        if (calculatedPriceSet) {
          acc[shipping_option_id] = calculatedPriceSet
        }

        return acc
      },
      {}
    )

    return new StepResponse(optionToCalculatedPriceSets)
  }
)
