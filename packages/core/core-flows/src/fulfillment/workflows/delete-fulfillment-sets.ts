import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { deleteFulfillmentSetsStep } from "../steps"
import { removeRemoteLinkStep } from "../../common"
import { Modules } from "@medusajs/modules-sdk"

export const deleteFulfillmentSetsWorkflowId =
  "delete-fulfillment-sets-workflow"
export const deleteFulfillmentSetsWorkflow = createWorkflow(
  deleteFulfillmentSetsWorkflowId,
  (input: WorkflowData<{ ids: string[] }>) => {
    deleteFulfillmentSetsStep(input.ids)

    removeRemoteLinkStep({
      [Modules.FULFILLMENT]: { fulfillment_set_id: input.ids },
    })
  }
)
