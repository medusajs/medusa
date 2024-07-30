import { CreatePriceListPricesWorkflowDTO, PricingTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import { createPriceListPricesStep } from "../steps/create-price-list-prices"
import { validatePriceListsStep } from "../steps/validate-price-lists"
import { validateVariantPriceLinksStep } from "../steps/validate-variant-price-links"

export const createPriceListPricesWorkflowId = "create-price-list-prices"
export const createPriceListPricesWorkflow = createWorkflow(
  createPriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      data: CreatePriceListPricesWorkflowDTO[]
    }>
  ): WorkflowResponse<PricingTypes.PriceDTO[]> => {
    const [_, variantPriceMap] = parallelize(
      validatePriceListsStep(input.data),
      validateVariantPriceLinksStep(input.data)
    )

    return new WorkflowResponse(
      createPriceListPricesStep({
        data: input.data,
        variant_price_map: variantPriceMap,
      })
    )
  }
)
