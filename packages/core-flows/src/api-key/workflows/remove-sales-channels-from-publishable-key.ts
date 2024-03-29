import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { detachApiKeysWithSalesChannelsStep } from "../steps/detach-sales-channels-from-publishable-keys"

type WorkflowInput = {
  data: {
    api_key_id: string
    sales_channel_ids: string[]
  }[]
}

export const removeSalesChannelsFromApiKeyWorkflowId =
  "remove-sales-channels-From-api-key"
export const removeSalesChannelsFromApiKeyWorkflow = createWorkflow(
  removeSalesChannelsFromApiKeyWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    detachApiKeysWithSalesChannelsStep({ links: input.data })
  }
)
