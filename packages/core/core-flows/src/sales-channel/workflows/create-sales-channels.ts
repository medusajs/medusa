import { CreateSalesChannelDTO, SalesChannelDTO } from "@medusajs/types"
import { SalesChannelWorkflowEvents } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createSalesChannelsStep } from "../steps/create-sales-channels"

export type CreateSalesChannelsWorkflowInput = {
  salesChannelsData: CreateSalesChannelDTO[]
}

export const createSalesChannelsWorkflowId = "create-sales-channels"
/**
 * This workflow creates one or more sales channels.
 */
export const createSalesChannelsWorkflow = createWorkflow(
  createSalesChannelsWorkflowId,
  (
    input: WorkflowData<CreateSalesChannelsWorkflowInput>
  ): WorkflowResponse<SalesChannelDTO[]> => {
    const createdSalesChannels = createSalesChannelsStep({
      data: input.salesChannelsData,
    })

    const salesChannelsIdEvents = transform(
      { createdSalesChannels },
      ({ createdSalesChannels }) => {
        return createdSalesChannels.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: SalesChannelWorkflowEvents.CREATED,
      data: salesChannelsIdEvents,
    })

    return new WorkflowResponse(createdSalesChannels)
  }
)
