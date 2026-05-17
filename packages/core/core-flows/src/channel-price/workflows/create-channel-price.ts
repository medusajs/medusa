import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createChannelPriceStep } from "../steps/create-channel-price"

export const createChannelPriceWorkflow = createWorkflow(
  "create-channel-price",
  (
    input: WorkflowData<{
      sales_material_id: string
      price_type: string
      amount: number
      [key: string]: unknown
    }>
  ) => {
    const channelPrice = createChannelPriceStep(input)
    return new WorkflowResponse(channelPrice)
  }
)
