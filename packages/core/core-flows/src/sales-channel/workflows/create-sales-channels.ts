import { CreateSalesChannelDTO, SalesChannelDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createSalesChannelsStep } from "../steps/create-sales-channels"

export type CreateSalesChannelsWorkflowInput = { salesChannelsData: CreateSalesChannelDTO[] }

export const createSalesChannelsWorkflowId = "create-sales-channels"
/**
 * This workflow creates one or more sales channels.
 */
export const createSalesChannelsWorkflow = createWorkflow(
  createSalesChannelsWorkflowId,
  (input: WorkflowData<CreateSalesChannelsWorkflowInput>): WorkflowResponse<SalesChannelDTO[]> => {
    return new WorkflowResponse(
      createSalesChannelsStep({ data: input.salesChannelsData })
    )
  }
)
