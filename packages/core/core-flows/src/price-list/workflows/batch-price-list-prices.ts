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

/**
 * The data to manage a price list's prices.
 */
export type BatchPriceListPricesWorkflowInput = {
  /**
   * The data to manage the prices of a price list.
   */
  data: BatchPriceListPricesWorkflowDTO
}

export const batchPriceListPricesWorkflowId = "batch-price-list-prices"
/**
 * This workflow manages a price list's prices by creating, updating, or removing them. It's used by the
 * [Manage Prices in Price List Admin API Route](https://docs.medusajs.com/api/admin/price-lists/manage-prices).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to 
 * manage price lists' prices in your custom flows.
 * 
 * @example
 * const { result } = await batchPriceListPricesWorkflow(container)
 * .run({
 *   input: {
 *     data: {
 *       id: "plist_123",
 *       create: [
 *         {
 *           amount: 10,
 *           currency_code: "usd",
 *           variant_id: "variant_123"
 *         }
 *       ],
 *       update: [
 *         {
 *           id: "price_123",
 *           amount: 10,
 *           currency_code: "usd",
 *           variant_id: "variant_123"
 *         }
 *       ],
 *       delete: ["price_321"]
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Manage a price list's prices.
 */
export const batchPriceListPricesWorkflow = createWorkflow(
  batchPriceListPricesWorkflowId,
  (
    input: WorkflowData<BatchPriceListPricesWorkflowInput>
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
