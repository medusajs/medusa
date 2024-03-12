import { UpdatePriceListWorkflowInputDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { upsertPriceListPricesStep } from "../steps"

type WorkflowInput = {
  price_lists_data: Pick<UpdatePriceListWorkflowInputDTO, "id" | "prices">[]
}

export const upsertPriceListPricesWorkflowId = "upsert-price-list-prices"
export const upsertPriceListPricesWorkflow = createWorkflow(
  upsertPriceListPricesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    upsertPriceListPricesStep(input.price_lists_data)
  }
)
