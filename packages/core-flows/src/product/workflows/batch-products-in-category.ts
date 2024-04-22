import { ProductCategoryWorkflow } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { batchLinkProductsToCategoryStep } from "../steps/batch-link-products-in-category"

export const batchLinkProductsToCategoryWorkflowId =
  "batch-link-products-to-category"
export const batchLinkProductsToCategoryWorkflow = createWorkflow(
  batchLinkProductsToCategoryWorkflowId,
  (
    // eslint-disable-next-line max-len
    input: WorkflowData<ProductCategoryWorkflow.BatchUpdateProductsOnCategoryWorkflowInput>
  ): WorkflowData<void> => {
    return batchLinkProductsToCategoryStep(input)
  }
)
