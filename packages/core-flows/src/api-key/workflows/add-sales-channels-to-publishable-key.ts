import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  associateApiKeysWithSalesChannelsStep,
  validateSalesChannelsExistStep,
} from "../steps"

type WorkflowInput = {
  data: {
    api_key_id: string
    sales_channel_ids: string[]
  }[]
}

export const addSalesChannelsToApiKeyWorkflowId =
  "add-sales-channels-to-api-key"
export const addSalesChannelsToApiKeyWorkflow = createWorkflow(
  addSalesChannelsToApiKeyWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const salesChannelIds = transform(input.data, (data) =>
      data.map((d) => d.sales_channel_ids).flat()
    )
    validateSalesChannelsExistStep({
      sales_channel_ids: salesChannelIds,
    })
    associateApiKeysWithSalesChannelsStep({ links: input.data })
  }
)
