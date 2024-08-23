import { LinkDefinition } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
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
