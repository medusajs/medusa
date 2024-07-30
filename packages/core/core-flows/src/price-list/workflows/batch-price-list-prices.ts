import {
  BatchPriceListPricesWorkflowDTO,
  BatchPriceListPricesWorkflowResult,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { createPriceListPricesWorkflowStep } from "../steps/create-price-list-prices-workflow"
import { removePriceListPricesWorkflowStep } from "../steps/remove-price-list-prices-workflow"
import { updatePriceListPricesWorkflowStep } from "../steps/update-price-list-prices-workflow"

export const batchPriceListPricesWorkflowId = "batch-price-list-prices"
export const batchPriceListPricesWorkflow = createWorkflow(
  batchPriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      data: BatchPriceListPricesWorkflowDTO
    }>
  ): WorkflowResponse<WorkflowData<BatchPriceListPricesWorkflowResult>> => {
    const createInput = transform({ input: input.data }, (data) => [
      { id: data.input.id, prices: data.input.create },
    ])

    const updateInput = transform({ input: input.data }, (data) => [
      { id: data.input.id, prices: data.input.update },
    ])

    const [created, updated, deleted] = parallelize(
      createPriceListPricesWorkflowStep(createInput),
      updatePriceListPricesWorkflowStep(updateInput),
      removePriceListPricesWorkflowStep(input.data.delete)
    )

    return new WorkflowResponse(
      transform({ created, updated, deleted }, (data) => data)
    )
  }
)
