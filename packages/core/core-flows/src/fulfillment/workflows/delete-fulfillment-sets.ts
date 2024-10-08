import { createWorkflow, WorkflowData } from "@medusajs/framework/workflows-sdk"
import { deleteFulfillmentSetsStep } from "../steps"
import { removeRemoteLinkStep } from "../../common"
import { Modules } from "@medusajs/framework/utils"

export const deleteFulfillmentSetsWorkflowId =
  "delete-fulfillment-sets-workflow"
/**
 * This workflow deletes one or more fulfillment sets.
 */
export const deleteFulfillmentSetsWorkflow = createWorkflow(
  deleteFulfillmentSetsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>) => {
    deleteFulfillmentSetsStep(input.ids)

    removeRemoteLinkStep({
      [Modules.FULFILLMENT]: { fulfillment_set_id: input.ids },
    })
  }
)
