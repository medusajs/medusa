import type {
  FilterableOrderTagProps,
  UpdateOrderTagDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateOrderTagsStep } from "../steps"

/**
 * The data to update one or more order tags.
 */
export type UpdateOrderTagsWorkflowInput = {
  /**
   * The filters to select the order tags to update.
   */
  selector: FilterableOrderTagProps
  /**
   * The data to update in the order tags.
   */
  update: UpdateOrderTagDTO
}

export const updateOrderTagsWorkflowId = "update-order-tags"
/**
 * This workflow updates one or more order tags. It's used by the
 * Update Order Tag Admin API Route.
 *
 * You can also use this workflow within your own custom workflows, allowing
 * you to wrap custom logic around order-tag updates.
 *
 * @example
 * const { result } = await updateOrderTagsWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "otag_123"
 *     },
 *     update: {
 *       value: "urgent"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more order tags.
 */
export const updateOrderTagsWorkflow = createWorkflow(
  updateOrderTagsWorkflowId,
  (input: WorkflowData<UpdateOrderTagsWorkflowInput>) => {
    const updatedOrderTags = updateOrderTagsStep(input)

    return new WorkflowResponse(updatedOrderTags)
  }
)
