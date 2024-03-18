import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { removePriceListPricesStep } from "../steps"

export const removePriceListPricesWorkflowId = "remove-price-list-prices"
export const removePriceListPricesWorkflow = createWorkflow(
  removePriceListPricesWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowData<void> => {
    removePriceListPricesStep(input.ids)
  }
)
