import {
  CreateSalesChannelDTO,
  SalesChannelDTO,
} from "@zjedene-medusa/framework/types"
import { SalesChannelWorkflowEvents } from "@zjedene-medusa/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@zjedene-medusa/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createSalesChannelsStep } from "../steps/create-sales-channels"

/**
 * The data to create sales channels.
 */
export type CreateSalesChannelsWorkflowInput = {
  /**
   * The sales channels to create.
   */
  salesChannelsData: CreateSalesChannelDTO[]
}

/**
 * The created sales channels.
 */
export type CreateSalesChannelsWorkflowOutput = SalesChannelDTO[]

export const createSalesChannelsWorkflowId = "create-sales-channels"
/**
 * This workflow creates one or more sales channels. It's used by the
 * [Create Sales Channel Admin API Route](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannels).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create sales channels within your custom flows.
 * 
 * @example
 * const { result } = await createSalesChannelsWorkflow(container)
 * .run({
 *   input: {
 *     salesChannelsData: [
 *       {
 *         name: "Webshop"
 *       }
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Create sales channels.
 */
export const createSalesChannelsWorkflow = createWorkflow(
  createSalesChannelsWorkflowId,
  (
    input: WorkflowData<CreateSalesChannelsWorkflowInput>
  ): WorkflowResponse<CreateSalesChannelsWorkflowOutput> => {
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
