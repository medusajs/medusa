import { createWorkflow, WorkflowData } from "@medusajs/framework/workflows-sdk"
import { deleteFulfillmentSetsStep } from "../steps"
import { removeRemoteLinkStep } from "../../common"
import { Modules } from "@medusajs/framework/utils"

/**
 * The data to delete one or more fulfillment sets.
 */
export type DeleteFulfillmentSetsWorkflowInput = {
  /**
   * The IDs of the fulfillment sets to delete.
   */
  ids: string[]
}

export const deleteFulfillmentSetsWorkflowId =
  "delete-fulfillment-sets-workflow"
/**
 * This workflow deletes one or more fulfillment sets. It's used by the
 * [Delete Fulfillment Sets Admin API Route](https://docs.medusajs.com/api/admin/fulfillment-sets/delete-fulfillment-set).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * delete fulfillment sets within your custom flows.
 * 
 * @example
 * const { result } = await deleteFulfillmentSetsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["fulset_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more fulfillment sets.
 */
export const deleteFulfillmentSetsWorkflow = createWorkflow(
  deleteFulfillmentSetsWorkflowId,
  (input: WorkflowData<DeleteFulfillmentSetsWorkflowInput>) => {
    deleteFulfillmentSetsStep(input.ids)

    removeRemoteLinkStep({
      [Modules.FULFILLMENT]: { fulfillment_set_id: input.ids },
    })
  }
)
