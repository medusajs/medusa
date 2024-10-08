import {
  BatchPriceListPricesWorkflowDTO,
  BatchPriceListPricesWorkflowResult,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createPriceListPricesWorkflow } from "./create-price-list-prices"
import { removePriceListPricesWorkflow } from "./remove-price-list-prices"
import { updatePriceListPricesWorkflow } from "./update-price-list-prices"

export const batchPriceListPricesWorkflowId = "batch-price-list-prices"
/**
 * This workflow manages price lists' prices by creating, updating, or removing them.
 */
export const batchPriceListPricesWorkflow = createWorkflow(
  batchPriceListPricesWorkflowId,
  (
    input: WorkflowData<{
      data: BatchPriceListPricesWorkflowDTO
    }>
  ): WorkflowResponse<BatchPriceListPricesWorkflowResult> => {
    const createInput = transform({ input: input.data }, (data) => [
      { id: data.input.id, prices: data.input.create },
    ])

    const updateInput = transform({ input: input.data }, (data) => [
      { id: data.input.id, prices: data.input.update },
    ])

    const [created, updated, deleted] = parallelize(
      createPriceListPricesWorkflow.runAsStep({
        input: {
          data: createInput,
        },
      }),
      updatePriceListPricesWorkflow.runAsStep({
        input: {
          data: updateInput,
        },
      }),
      removePriceListPricesWorkflow.runAsStep({
        input: {
          ids: input.data.delete,
        },
      })
    )

    return new WorkflowResponse(
      transform({ created, updated, deleted }, (data) => data)
    )
  }
)
