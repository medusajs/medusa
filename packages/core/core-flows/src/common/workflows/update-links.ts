import { LinkDefinition } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateRemoteLinksStep } from "../steps/update-remote-links"

export const updateLinksWorkflowId = "update-link"
/**
 * This workflow updates one or more links between records.
 */
export const updateLinksWorkflow = createWorkflow(
  updateLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return new WorkflowResponse(updateRemoteLinksStep(input))
  }
)
