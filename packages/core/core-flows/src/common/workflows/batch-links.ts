import { LinkDefinition } from "@medusajs/modules-sdk"
import { BatchWorkflowInput } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep } from "../steps/create-remote-links"
import { dismissRemoteLinkStep } from "../steps/dismiss-remote-links"
import { updateRemoteLinksStep } from "../steps/update-remote-links"

export const batchLinksWorkflowId = "batch-links"
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
