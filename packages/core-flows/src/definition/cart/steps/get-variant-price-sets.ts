import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, PricingContext } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  variantIds: string[]
  context?: PricingContext
}

export const getVariantPriceSetsStepId = "get-variant-price-sets"
export const getVariantPriceSetsStep = createStep(
  getVariantPriceSetsStepId,
  async (data: StepInput, { container }) => {
    if (!data.variantIds.length) {
      return new StepResponse({})
    }

    const pricingModuleService = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const remoteQuery = container.resolve("remoteQuery")

    const variantPriceSets = await remoteQuery(
      {
        variant: {
          fields: ["id"],
          price: {
            fields: ["price_set_id"],
          },
        },
      },
      {
        variant: {
          id: data.variantIds,
        },
      }
    )

    const notFound: string[] = []
    const priceSetIds: string[] = []

    variantPriceSets.forEach((v) => {
      if (v.price?.price_set_id) {
        priceSetIds.push(v.price.price_set_id)
      } else {
        notFound.push(v.id)
      }
    })

    if (notFound.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variants with IDs ${notFound.join(", ")} do not have a price`
      )
    }

    const calculatedPriceSets = await pricingModuleService.calculatePrices(
      { id: priceSetIds },
      { context: data.context as Record<string, string | number> }
    )

    const idToPriceSet = new Map<string, Record<string, any>>(
      calculatedPriceSets.map((p) => [p.id, p])
    )

    const variantToCalculatedPriceSets = variantPriceSets.reduce(
      (acc, { id, price }) => {
        const calculatedPriceSet = idToPriceSet.get(price?.price_set_id)
        if (calculatedPriceSet) {
          acc[id] = calculatedPriceSet
        }

        return acc
      },
      {}
    )

    return new StepResponse(variantToCalculatedPriceSets)
  }
)
