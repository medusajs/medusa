import { UpdatePriceListWorkflowInputDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import {
  upsertPriceListPricesStep,
  validatePriceListsStep,
  validateVariantPriceLinksStep,
} from "../steps"

type WorkflowInput = {
  price_lists_data: Pick<UpdatePriceListWorkflowInputDTO, "id" | "prices">[]
}

export const upsertPriceListPricesWorkflowId = "upsert-price-list-prices"
export const upsertPriceListPricesWorkflow = createWorkflow(
  upsertPriceListPricesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    validatePriceListsStep(input.price_lists_data)
    const variantPriceMap = validateVariantPriceLinksStep(
      input.price_lists_data
    )

    upsertPriceListPricesStep({
      data: input.price_lists_data,
      variant_price_map: variantPriceMap,
    })
  }
)
