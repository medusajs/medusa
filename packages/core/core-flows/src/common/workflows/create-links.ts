import { LinkDefinition } from "@medusajs/modules-sdk"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createLinkStep } from "../steps/create-remote-links"

export const createLinksWorkflowId = "create-link"
export const createLinksWorkflow = createWorkflow(
  createLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return createLinkStep(input)
  }
)
