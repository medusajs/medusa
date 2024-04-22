import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { BatchLinkProductsToCollectionDTO } from "@medusajs/types/src"
import { batchLinkProductsToCollectionStep } from "../steps/batch-link-products-collection"

export const batchLinkProductsToCollectionWorkflowId =
  "batch-link-products-to-collection"
export const batchLinkProductsToCollectionWorkflow = createWorkflow(
  batchLinkProductsToCollectionWorkflowId,
  (
    input: WorkflowData<BatchLinkProductsToCollectionDTO>
  ): WorkflowData<void> => {
    return batchLinkProductsToCollectionStep(input)
  }
)
