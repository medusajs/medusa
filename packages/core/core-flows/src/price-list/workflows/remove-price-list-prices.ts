import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { removePriceListPricesStep } from "../steps/remove-price-list-prices"

/**
 * The data to remove prices.
 */
export type RemovePriceListPricesWorkflowInput = {
  /**
   * The IDs of the prices to remove.
   */
  ids: string[]
}

export const removePriceListPricesWorkflowId = "remove-price-list-prices"
/**
 * This workflow removes prices. It's used by other workflows, such
 * as {@link batchPriceListPricesWorkflow}.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * remove prices in your custom flows.
 *
 * @example
 * const { result } = await removePriceListPricesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["price_123"]
 *   }
 * })
 *
 * @summary
 *
 * Remove prices.
 */
export const removePriceListPricesWorkflow = createWorkflow(
  removePriceListPricesWorkflowId,
  (
    input: WorkflowData<RemovePriceListPricesWorkflowInput>
  ): WorkflowResponse<string[]> => {
    return new WorkflowResponse(removePriceListPricesStep(input.ids))
  }
)
