import type { CreateOrderTagDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createOrderTagsStep } from "../steps"

/**
 * The data to create one or more order tags.
 */
export type CreateOrderTagsWorkflowInput = {
  /**
   * The order tags to create.
   */
  order_tags: CreateOrderTagDTO[]
}

export const createOrderTagsWorkflowId = "create-order-tags"
/**
 * This workflow creates one or more order tags. It's used by the
 * Create Order Tag Admin API Route.
 *
 * Unlike the equivalent product-tag workflow, this workflow is a
 * find-or-create: a tag whose `value` already exists is returned as-is
 * instead of erroring.
 *
 * You can also use this workflow within your own custom workflows, allowing
 * you to wrap custom logic around order-tag creation.
 *
 * @example
 * const { result } = await createOrderTagsWorkflow(container)
 * .run({
 *   input: {
 *     order_tags: [
 *       {
 *         value: "priority"
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more order tags.
 */
export const createOrderTagsWorkflow = createWorkflow(
  createOrderTagsWorkflowId,
  (input: WorkflowData<CreateOrderTagsWorkflowInput>) => {
    const orderTags = createOrderTagsStep(input.order_tags)

    return new WorkflowResponse(orderTags)
  }
)
