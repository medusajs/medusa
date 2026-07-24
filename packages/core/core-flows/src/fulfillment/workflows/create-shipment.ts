import type { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { validateShipmentStep } from "../steps"
import { updateFulfillmentWorkflow } from "./update-fulfillment"

export const createShipmentWorkflowId = "create-shipment-workflow"
/**
 * This workflow creates shipments for a fulfillment. It's used by the
 * [Create Shipment Admin API Route](https://docs.medusajs.com/api/admin/fulfillments/create-shipment).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * create shipments within your custom flows.
 *
 * @example
 * const { result } = await createShipmentWorkflow(container)
 * .run({
 *   input: {
 *     id: "ful_123",
 *     labels: [
 *       {
 *         tracking_url: "https://example.com",
 *         tracking_number: "123",
 *         label_url: "https://example.com"
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create a shipment for a fulfillment.
 */
export const createShipmentWorkflow = createWorkflow(
  createShipmentWorkflowId,
  (input: WorkflowData<FulfillmentWorkflow.CreateShipmentWorkflowInput>) => {
    validateShipmentStep(input.id)

    const update = transform({ input }, (data) => ({
      ...data.input,
      shipped_at: new Date(),
    }))

    return new WorkflowResponse(
      updateFulfillmentWorkflow.runAsStep({
        input: update,
      })
    )
  }
)
