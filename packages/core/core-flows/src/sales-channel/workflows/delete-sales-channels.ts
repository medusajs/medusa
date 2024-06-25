import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"

import { deleteSalesChannelsStep } from "../steps/delete-sales-channels"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { Modules } from "@medusajs/utils"

type WorkflowInput = { ids: string[] }

export const deleteSalesChannelsWorkflowId = "delete-sales-channels"
export const deleteSalesChannelsWorkflow = createWorkflow(
  deleteSalesChannelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    deleteSalesChannelsStep(input.ids)

    removeRemoteLinkStep({
      [Modules.SALES_CHANNEL]: { sales_channel_id: input.ids },
    })
  }
)
