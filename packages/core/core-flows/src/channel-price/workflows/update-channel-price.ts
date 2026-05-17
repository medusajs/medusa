import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateChannelPriceStep } from "../steps/update-channel-price"

export const updateChannelPriceWorkflow = createWorkflow(
  "update-channel-price",
  (input: WorkflowData<{ id: string; [key: string]: unknown }>) => {
    const channelPrice = updateChannelPriceStep(input)
    return new WorkflowResponse(channelPrice)
  }
)
