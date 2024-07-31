import { LinkDefinition } from "@medusajs/modules-sdk"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep } from "../steps/create-remote-links"

export const createLinksWorkflowId = "create-link"
export const createLinksWorkflow = createWorkflow(
  createLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return new WorkflowResponse(createRemoteLinkStep(input))
  }
)
