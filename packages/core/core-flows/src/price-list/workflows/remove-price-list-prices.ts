import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { removePriceListPricesStep } from "../steps/remove-price-list-prices"

export const removePriceListPricesWorkflowId = "remove-price-list-prices"
export const removePriceListPricesWorkflow = createWorkflow(
  removePriceListPricesWorkflowId,
  (
    input: WorkflowData<{ ids: string[] }>
  ): WorkflowResponse<WorkflowData<string[]>> => {
    return new WorkflowResponse(removePriceListPricesStep(input.ids))
  }
)
