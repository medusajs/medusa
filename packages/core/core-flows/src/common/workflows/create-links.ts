import { LinkDefinition } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../steps/create-remote-links"

export const createLinksWorkflowId = "create-link"
/**
 * This workflow creates one or more links between records.
 */
export const createLinksWorkflow = createWorkflow(
  createLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return new WorkflowResponse(createRemoteLinkStep(input))
  }
)
