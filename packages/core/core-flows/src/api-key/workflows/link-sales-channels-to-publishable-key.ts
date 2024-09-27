import { LinkWorkflowInput } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import {
  linkSalesChannelsToApiKeyStep,
  validateSalesChannelsExistStep,
} from "../steps"

export const linkSalesChannelsToApiKeyWorkflowId =
  "link-sales-channels-to-api-key"
/**
 * This workflow links sales channels to API keys.
 */
export const linkSalesChannelsToApiKeyWorkflow = createWorkflow(
  linkSalesChannelsToApiKeyWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>) => {
    validateSalesChannelsExistStep({
      sales_channel_ids: input.add ?? [],
    })

    linkSalesChannelsToApiKeyStep(input)
  }
)
