import { CreateSalesChannelDTO, SalesChannelDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createSalesChannelsStep } from "../steps/create-sales-channels"

type WorkflowInput = { salesChannelsData: CreateSalesChannelDTO[] }

export const createSalesChannelsWorkflowId = "create-sales-channels"
export const createSalesChannelsWorkflow = createWorkflow(
  createSalesChannelsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<SalesChannelDTO[]>> => {
    return new WorkflowResponse(
      createSalesChannelsStep({ data: input.salesChannelsData })
    )
  }
)
