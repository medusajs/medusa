import { Modules, SalesChannelWorkflowEvents } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteSalesChannelsStep } from "../steps/delete-sales-channels"

export type DeleteSalesChannelsWorkflowInput = { ids: string[] }

export const deleteSalesChannelsWorkflowId = "delete-sales-channels"
/**
 * This workflow deletes one or more sales channels.
 */
export const deleteSalesChannelsWorkflow = createWorkflow(
  deleteSalesChannelsWorkflowId,
  (
    input: WorkflowData<DeleteSalesChannelsWorkflowInput>
  ): WorkflowData<void> => {
    deleteSalesChannelsStep(input.ids)

    removeRemoteLinkStep({
      [Modules.SALES_CHANNEL]: { sales_channel_id: input.ids },
    })

    const salesChannelsIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: SalesChannelWorkflowEvents.DELETED,
      data: salesChannelsIdEvents,
    })
  }
)
