import { ProductCategoryWorkflow } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { batchLinkProductsToCategoryStep } from "../steps/batch-link-products-in-category"

export const batchLinkProductsToCategoryWorkflowId =
  "batch-link-products-to-category"
/**
 * This workflow creates links between product and category records.
 */
export const batchLinkProductsToCategoryWorkflow = createWorkflow(
  batchLinkProductsToCategoryWorkflowId,
  (
    // eslint-disable-next-line max-len
    input: WorkflowData<ProductCategoryWorkflow.BatchUpdateProductsOnCategoryWorkflowInput>
  ): WorkflowData<void> => {
    return batchLinkProductsToCategoryStep(input)
  }
)
