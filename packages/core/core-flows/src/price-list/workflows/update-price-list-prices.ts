import { PricingTypes, UpdatePriceListPricesWorkflowDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import { updatePriceListPricesStep } from "../steps/update-price-list-prices"
import { validatePriceListsStep } from "../steps/validate-price-lists"
import { validateVariantPriceLinksStep } from "../steps/validate-variant-price-links"

export const updatePriceListPricesWorkflowId = "update-price-list-prices"
export const updatePriceListPricesWorkflow = createWorkflow(
  updatePriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      data: UpdatePriceListPricesWorkflowDTO[]
    }>
  ): WorkflowResponse<PricingTypes.PriceDTO[]> => {
    const [_, variantPriceMap] = parallelize(
      validatePriceListsStep(input.data),
      validateVariantPriceLinksStep(input.data)
    )

    return new WorkflowResponse(
      updatePriceListPricesStep({
        data: input.data,
        variant_price_map: variantPriceMap,
      })
    )
  }
)
