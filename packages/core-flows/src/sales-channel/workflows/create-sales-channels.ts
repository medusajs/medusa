import { CreateSalesChannelDTO, SalesChannelDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createSalesChannelsStep } from "../steps/create-sales-channels"

type WorkflowInput = { salesChannelsData: CreateSalesChannelDTO[] }

export const createSalesChannelsWorkflowId = "create-sales-channels"
export const createSalesChannelsWorkflow = createWorkflow(
  createSalesChannelsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<SalesChannelDTO[]> => {
    return createSalesChannelsStep({ data: input.salesChannelsData })
  }
)
