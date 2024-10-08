import { IPricingModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export interface GetVariantPriceSetsStepInput {
  variantIds: string[]
  context?: Record<string, unknown>
}

export const getVariantPriceSetsStepId = "get-variant-price-sets"
/**
 * This step retrieves the calculated price sets of the specified variants.
 */
export const getVariantPriceSetsStep = createStep(
  getVariantPriceSetsStepId,
  async (data: GetVariantPriceSetsStepInput, { container }) => {
    if (!data.variantIds.length) {
      return new StepResponse({})
    }

    const pricingModuleService = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    const remoteQuery = container.resolve("remoteQuery")

    const variantPriceSets = await remoteQuery({
      entryPoint: "variant",
      fields: ["id", "price_set.id"],
      variables: {
        id: data.variantIds,
      },
    })

    const notFound: string[] = []
    const priceSetIds: string[] = []

    variantPriceSets.forEach((v) => {
      if (v.price_set?.id) {
        priceSetIds.push(v.price_set.id)
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
      (acc, { id, price_set }) => {
        const calculatedPriceSet = idToPriceSet.get(price_set?.id)
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
