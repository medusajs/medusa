import {
  CreatePriceListPriceWorkflowDTO,
  UpdatePriceListPriceWorkflowDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { upsertPriceListPricesStep } from "../steps"

type WorkflowInput = {
  price_list_id: string
  prices: (UpdatePriceListPriceWorkflowDTO | CreatePriceListPriceWorkflowDTO)[]
}[]

export const upsertPriceListPricesWorkflowId = "upsert-price-list-prices"
export const upsertPriceListPricesWorkflow = createWorkflow(
  upsertPriceListPricesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    upsertPriceListPricesStep(input)
  }
)
