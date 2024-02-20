import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, RegionDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  variantIds: string[]
  // TODO: Expand the context passed to calculatePrices
  region: RegionDTO
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

    const variables = {
      variant_id: data.variantIds,
      take: null, // TODO: We probably want to add a limit here
    }

    const query = {
      product_variant_price_set: {
        fields: ["variant_id", "price_set_id"],
      },
    }

    const remoteQuery = container.resolve("remoteQuery")

    const variantPriceSets = await remoteQuery(query, {
      product_variant_price_set: variables,
    })

    if (!variantPriceSets.length) {
      return new StepResponse({})
    }

    const priceSetToVariant: Map<string, string> = new Map(
      variantPriceSets.map((variantPriceSet) => [
        variantPriceSet.price_set_id,
        variantPriceSet.variant_id,
      ])
    )

    const calculatedPriceSets = await pricingModuleService.calculatePrices(
      { id: [...priceSetToVariant.keys()] },
      { context: { currency_code: data.region.currency_code } } // TODO: Should allow for more context properties
    )

    const variantToCalculatedPriceSets = {}

    for (const priceSet of calculatedPriceSets) {
      const variantId = priceSetToVariant.get(priceSet.id)!
      variantToCalculatedPriceSets[variantId] = priceSet
    }

    return new StepResponse(variantToCalculatedPriceSets)
  }
)
