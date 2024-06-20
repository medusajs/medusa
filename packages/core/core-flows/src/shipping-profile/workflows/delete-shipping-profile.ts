import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"

import { deleteShippingProfilesStep } from "../steps"
import { removeRemoteLinkStep } from "../../common"
import { Modules } from "@medusajs/utils"

export const deleteShippingProfileWorkflowId =
  "delete-shipping-profile-workflow"
export const deleteShippingProfileWorkflow = createWorkflow(
  deleteShippingProfileWorkflowId,
  (input: WorkflowData<{ ids: string[] }>) => {
    deleteShippingProfilesStep(input.ids)

    removeRemoteLinkStep({
      [Modules.FULFILLMENT]: { shipping_profile_id: input.ids },
    })
  }
)
