import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { removePriceListPricesStep } from "../steps/remove-price-list-prices"

export const removePriceListPricesWorkflowId = "remove-price-list-prices"
/**
 * This workflow removes price lists' prices.
 */
export const removePriceListPricesWorkflow = createWorkflow(
  removePriceListPricesWorkflowId,
  (input: WorkflowData<{ ids: string[] }>): WorkflowResponse<string[]> => {
    return new WorkflowResponse(removePriceListPricesStep(input.ids))
  }
)
