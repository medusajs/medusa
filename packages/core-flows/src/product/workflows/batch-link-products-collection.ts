import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { LinkWorkflowInput } from "@medusajs/types/src"
import { batchLinkProductsToCollectionStep } from "../steps/batch-link-products-collection"

export const batchLinkProductsToCollectionWorkflowId =
  "batch-link-products-to-collection"
export const batchLinkProductsToCollectionWorkflow = createWorkflow(
  batchLinkProductsToCollectionWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    return batchLinkProductsToCollectionStep(input)
  }
)
