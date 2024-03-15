import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { removePriceListPricesStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const removePriceListPricesWorkflowId = "remove-price-list-prices"
export const removePriceListPricesWorkflow = createWorkflow(
  removePriceListPricesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    removePriceListPricesStep(input.ids)
  }
)
