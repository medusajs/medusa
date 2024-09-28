import { FulfillmentWorkflow } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const validateShippingOptionPricesStepId =
  "validate-shipping-option-prices"

/**
 * Validate that regions exist for the shipping option prices.
 */
export const validateShippingOptionPricesStep = createStep(
  validateShippingOptionPricesStepId,
  async (
    options: {
      prices?: FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput["prices"]
    }[],
    { container }
  ) => {
    const allPrices = options.flatMap((option) => {
      if (!option.prices) {
        return []
      }
      return option.prices
    })

    const regionIdSet = new Set<string>()

    allPrices.forEach((p) => {
      if ("region_id" in p && p.region_id) {
        regionIdSet.add(p.region_id)
      }
    })

    const regionService = container.resolve(Modules.REGION)
    const regionList = await regionService.listRegions({
      id: Array.from(regionIdSet),
    })

    if (regionList.length !== regionIdSet.size) {
      const missingRegions = Array.from(regionIdSet).filter(
        (id) => !regionList.some((region) => region.id === id)
      )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot create prices for non-existent regions. Region with ids [${missingRegions.join(
          ", "
        )}] were not found.`
      )
    }

    return new StepResponse(void 0)
  }
)
