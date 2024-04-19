import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { removePriceListPricesStep } from "../steps/remove-price-list-prices"

export const removePriceListPricesWorkflowId = "remove-price-list-prices"
export const removePriceListPricesWorkflow = createWorkflow(
  removePriceListPricesWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowData<string[]> => {
    return removePriceListPricesStep(input.ids)
  }
)
