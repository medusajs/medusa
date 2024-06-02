import { LinkDefinition } from "@medusajs/modules-sdk"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateLinksStep } from "../steps/update-remote-links"

export const updateLinksWorkflowId = "update-link"
export const updateLinksWorkflow = createWorkflow(
  updateLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return updateLinksStep(input)
  }
)
