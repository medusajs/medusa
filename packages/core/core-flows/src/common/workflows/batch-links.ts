import { BatchWorkflowInput, LinkDefinition } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../steps/create-remote-links"
import { dismissRemoteLinkStep } from "../steps/dismiss-remote-links"
import { updateRemoteLinksStep } from "../steps/update-remote-links"

export const batchLinksWorkflowId = "batch-links"
/**
 * This workflow manages one or more links to create, update, or dismiss them.
 */
export const batchLinksWorkflow = createWorkflow(
  batchLinksWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<LinkDefinition, LinkDefinition, LinkDefinition>
    >
  ) => {
    const [created, updated, deleted] = parallelize(
      createRemoteLinkStep(input.create || []),
      updateRemoteLinksStep(input.update || []),
      dismissRemoteLinkStep(input.delete || [])
    )

    return new WorkflowResponse({
      created,
      updated,
      deleted,
    })
  }
)
