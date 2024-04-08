import { UpdatePriceListPricesWorkflowDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import {
  updatePriceListPricesStep,
  validatePriceListsStep,
  validateVariantPriceLinksStep,
} from "../steps"

export const updatePriceListPricesWorkflowId = "update-price-list-prices"
export const updatePriceListPricesWorkflow = createWorkflow(
  updatePriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      data: UpdatePriceListPricesWorkflowDTO[]
    }>
  ): WorkflowData<void> => {
    const [_, variantPriceMap] = parallelize(
      validatePriceListsStep(input.data),
      validateVariantPriceLinksStep(input.data)
    )

    updatePriceListPricesStep({
      data: input.data,
      variant_price_map: variantPriceMap,
    })
  }
)
