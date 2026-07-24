import type { UpdatePriceListWorkflowInputDTO } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { updatePriceListsStep, validatePriceListsStep } from "../steps"

/**
 * The data to update price lists.
 */
export type UpdatePriceListsWorkflowInput = {
  /**
   * The price lists to update.
   */
  price_lists_data: UpdatePriceListWorkflowInputDTO[]
}

export const updatePriceListsWorkflowId = "update-price-lists"
/**
 * This workflow updates one or more price lists. It's used by the
 * [Update Price List Admin API Route](https://docs.medusajs.com/api/admin/price-lists/update-a-price-list).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * update price lists in your custom flows.
 *
 * @example
 * const { result } = await updatePriceListsWorkflow(container)
 * .run({
 *   input: {
 *     price_lists_data: [
 *       {
 *         id: "plist_123",
 *         title: "Test Price List",
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Update one or more price lists.
 */
export const updatePriceListsWorkflow = createWorkflow(
  updatePriceListsWorkflowId,
  (
    input: WorkflowData<{ price_lists_data: UpdatePriceListWorkflowInputDTO[] }>
  ): WorkflowData<void> => {
    validatePriceListsStep(input.price_lists_data)

    updatePriceListsStep(input.price_lists_data)
  }
)
