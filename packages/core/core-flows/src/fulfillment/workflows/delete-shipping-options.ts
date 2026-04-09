import type { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  createWorkflow,
  parallelize,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { deleteShippingOptionsStep } from "../steps"
import { emitEventStep, removeRemoteLinkStep } from "../../common"
import { ShippingOptionWorkflowEvents } from "@medusajs/framework/utils"

export const deleteShippingOptionsWorkflowId =
  "delete-shipping-options-workflow"
/**
 * This workflow deletes one or more shipping options. It's used by the
 * [Delete Shipping Options Admin API Route](https://docs.medusajs.com/api/admin#shipping-options_deleteshippingoptionsid).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * delete shipping options within your custom flows.
 *
 * @example
 * const { result } = await deleteShippingOptionsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["so_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more shipping options.
 */
export const deleteShippingOptionsWorkflow = createWorkflow(
  deleteShippingOptionsWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.DeleteShippingOptionsWorkflowInput>
  ) => {
    const softDeletedEntities = deleteShippingOptionsStep(input.ids)

    parallelize(
      removeRemoteLinkStep(softDeletedEntities),
      emitEventStep({
        eventName: ShippingOptionWorkflowEvents.DELETED,
        data: input.ids,
      })
    )
  }
)
