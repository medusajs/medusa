import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"

import { deleteSalesChannelsStep } from "../steps/delete-sales-channels"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { Modules } from "@medusajs/utils"

export type DeleteSalesChannelsWorkflowInput = { ids: string[] }

export const deleteSalesChannelsWorkflowId = "delete-sales-channels"
/**
 * This workflow deletes one or more sales channels.
 */
export const deleteSalesChannelsWorkflow = createWorkflow(
  deleteSalesChannelsWorkflowId,
  (input: WorkflowData<DeleteSalesChannelsWorkflowInput>): WorkflowData<void> => {
    deleteSalesChannelsStep(input.ids)

    removeRemoteLinkStep({
      [Modules.SALES_CHANNEL]: { sales_channel_id: input.ids },
    })
  }
)
