import type { FulfillmentWorkflow } from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { updateFulfillmentStep } from "../steps"

export const updateFulfillmentWorkflowId = "update-fulfillment-workflow"
/**
 * This workflow updates a fulfillment. It's used by other workflows that update a
 * fulfillment, such as {@link markFulfillmentAsDeliveredWorkflow}.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * update a fulfillment within your custom flows.
 *
 * @example
 * const { result } = await updateFulfillmentWorkflow(container)
 * .run({
 *   input: {
 *     id: "ful_123",
 *     delivered_at: new Date(),
 *   }
 * })
 *
 * @summary
 *
 * Update a fulfillment.
 */
export const updateFulfillmentWorkflow = createWorkflow(
  updateFulfillmentWorkflowId,
  (input: WorkflowData<FulfillmentWorkflow.UpdateFulfillmentWorkflowInput>) => {
    return new WorkflowResponse(updateFulfillmentStep(input))
  }
)
