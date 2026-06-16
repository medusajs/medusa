import type { ProductCategoryWorkflow } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { batchLinkProductsToCategoryStep } from "../steps/batch-link-products-in-category"

export const batchLinkProductsToCategoryWorkflowId =
  "batch-link-products-to-category"
/**
 * This workflow manages the links between a category and products. It's used by the
 * [Manage Products of Category Admin API Route](https://docs.medusajs.com/api/admin#product-categories_postproductcategoriesidproducts).
 *
 * You can use this workflow within your own customizations or custom workflows to manage the products in a category.
 *
 * @example
 * const { result } = await batchLinkProductsToCategoryWorkflow(container)
 * .run({
 *   input: {
 *     id: "pcat_123",
 *     add: ["prod_123"],
 *     remove: ["prod_321"]
 *   }
 * })
 *
 * @summary
 *
 * Manage the links between a collection and products.
 */
export const batchLinkProductsToCategoryWorkflow = createWorkflow(
  batchLinkProductsToCategoryWorkflowId,
  (
    // eslint-disable-next-line max-len
    input: WorkflowData<ProductCategoryWorkflow.BatchUpdateProductsOnCategoryWorkflowInput>
  ): WorkflowData<void> => {
    batchLinkProductsToCategoryStep(input)
  }
)
