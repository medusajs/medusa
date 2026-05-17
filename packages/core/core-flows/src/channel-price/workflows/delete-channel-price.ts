import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteChannelPriceStep } from "../steps/delete-channel-price"

export const deleteChannelPriceWorkflow = createWorkflow(
  "delete-channel-price",
  (input: WorkflowData<{ id: string }>) => {
    deleteChannelPriceStep(input)
    return new WorkflowResponse(void 0)
  }
)
