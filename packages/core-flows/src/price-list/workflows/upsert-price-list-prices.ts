import { UpdatePriceListWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import {
  upsertPriceListPricesStep,
  validatePriceListsStep,
  validateVariantPriceLinksStep,
} from "../steps"

export const upsertPriceListPricesWorkflowId = "upsert-price-list-prices"
export const upsertPriceListPricesWorkflow = createWorkflow(
  upsertPriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      price_lists_data: Pick<UpdatePriceListWorkflowInputDTO, "id" | "prices">[]
    }>
  ): WorkflowData<void> => {
    const [_, variantPriceMap] = parallelize(
      validatePriceListsStep(input.price_lists_data),
      validateVariantPriceLinksStep(input.price_lists_data)
    )

    upsertPriceListPricesStep({
      data: input.price_lists_data,
      variant_price_map: variantPriceMap,
    })
  }
)
