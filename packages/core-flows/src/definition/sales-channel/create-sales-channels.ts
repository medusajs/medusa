import { createWorkflow } from "@medusajs/workflows-sdk"
import { CreateSalesChannelDTO, SalesChannelDTO } from "@medusajs/types"

import { createSalesChannelsStep } from "../../handlers/sales-channel"

type WorkflowInput = {
  channelsData: CreateSalesChannelDTO[]
}

type WorkflowOutput = SalesChannelDTO[]

export const createSalesChannelWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput
>("create-sales-channels", function (input) {
  return createSalesChannelsStep(input.channelsData)
})
