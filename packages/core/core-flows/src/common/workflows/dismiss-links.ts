import { LinkDefinition } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { dismissRemoteLinkStep } from "../steps/dismiss-remote-links"

export const dismissLinksWorkflowId = "dismiss-link"
/**
 * This workflow dismisses one or more links between records.
 */
export const dismissLinksWorkflow = createWorkflow(
  dismissLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return new WorkflowResponse(dismissRemoteLinkStep(input))
  }
)
