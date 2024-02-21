import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  variantIds: string[]
  context: {
    region_id?: string
    currency_code?: string
  }
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
      `
      query {
        variant (id: $id) {
          id
          price {
            price_set_id
          }
        }       
      }
    `,
      {
        id: data.variantIds,
      }
    )

    if (variantPriceSets.length !== data.variantIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Not all variants have a price associated with them"
      )
    }

    const calculatedPriceSets = await pricingModuleService.calculatePrices(
      { id: [...variantPriceSets.map((v) => v.price.price_set_id)] },
      { context: data.context }
    )

    const idToPriceSet = new Map<string, Record<string, any>>(
      calculatedPriceSets.map((p) => [p.id, p])
    )

    const variantToCalculatedPriceSets: Record<string, any> = {}

    for (const variantPriceSet of variantPriceSets) {
      const priceSetId = variantPriceSet.price.price_set_id
      const calculatedPriceSet = idToPriceSet.get(priceSetId)
      variantToCalculatedPriceSets[variantPriceSet.id] = calculatedPriceSet
    }

    return new StepResponse(variantToCalculatedPriceSets)
  }
)
