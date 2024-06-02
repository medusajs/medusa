import { LinkDefinition } from "@medusajs/modules-sdk"
import { BatchWorkflowInput } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
} from "@medusajs/workflows-sdk"
import { createLinkStep } from "../steps/create-remote-links"
import { dismissRemoteLinkStep } from "../steps/dismiss-remote-links"
import { updateLinksStep } from "../steps/update-remote-links"

export const batchLinksWorkflowId = "batch-links"
export const batchLinksWorkflow = createWorkflow(
  batchLinksWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<LinkDefinition, LinkDefinition, LinkDefinition>
    >
  ) => {
    const [created, updated, deleted] = parallelize(
      createLinkStep(input.create || []),
      updateLinksStep(input.update || []),
      dismissRemoteLinkStep(input.delete || [])
    )

    return {
      created,
      updated,
      deleted,
    }
  }
)
