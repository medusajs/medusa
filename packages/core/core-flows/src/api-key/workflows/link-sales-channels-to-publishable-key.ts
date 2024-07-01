import { LinkWorkflowInput } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import {
  linkSalesChannelsToApiKeyStep,
  validateSalesChannelsExistStep,
} from "../steps"

export const linkSalesChannelsToApiKeyWorkflowId =
  "link-sales-channels-to-api-key"
export const linkSalesChannelsToApiKeyWorkflow = createWorkflow(
  linkSalesChannelsToApiKeyWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>) => {
    validateSalesChannelsExistStep({
      sales_channel_ids: input.add ?? [],
    })

    linkSalesChannelsToApiKeyStep(input)
  }
)
