import {
  FilterableSalesChannelProps,
  SalesChannelDTO,
  UpdateSalesChannelDTO,
} from "@medusajs/framework/types"
import { SalesChannelWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { updateSalesChannelsStep } from "../steps/update-sales-channels"

export type UpdateSalesChannelsWorkflowInput = {
  selector: FilterableSalesChannelProps
  update: UpdateSalesChannelDTO
}

export const updateSalesChannelsWorkflowId = "update-sales-channels"
/**
 * This workflow updates sales channels matching the specified conditions.
 */
export const updateSalesChannelsWorkflow = createWorkflow(
  updateSalesChannelsWorkflowId,
  (
    input: WorkflowData<UpdateSalesChannelsWorkflowInput>
  ): WorkflowResponse<SalesChannelDTO[]> => {
    const updatedSalesChannels = updateSalesChannelsStep(input)

    const salesChannelIdEvents = transform(
      { updatedSalesChannels },
      ({ updatedSalesChannels }) => {
        const arr = Array.isArray(updatedSalesChannels)
          ? updatedSalesChannels
          : [updatedSalesChannels]
        return arr?.map((salesChannel) => {
          return { id: salesChannel.id }
        })
      }
    )

    emitEventStep({
      eventName: SalesChannelWorkflowEvents.UPDATED,
      data: salesChannelIdEvents,
    })

    return new WorkflowResponse(updatedSalesChannels)
  }
)
