import { LinkWorkflowInput } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { batchLinkProductsToCollectionStep } from "../steps/batch-link-products-collection"

export const batchLinkProductsToCollectionWorkflowId =
  "batch-link-products-to-collection"

/**
 * This workflow creates links between product and collection records.
 */
export const batchLinkProductsToCollectionWorkflow = createWorkflow(
  batchLinkProductsToCollectionWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    return batchLinkProductsToCollectionStep(input)
  }
)
