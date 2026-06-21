import type { LinkWorkflowInput } from "@medusajs/framework/types"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { batchLinkProductsToCollectionStep } from "../steps/batch-link-products-collection"

export const batchLinkProductsToCollectionWorkflowId =
  "batch-link-products-to-collection"

/**
 * This workflow manages the links between a collection and products. It's used by the
 * [Manage Products of Collection Admin API Route](https://docs.medusajs.com/api/admin#collections_postcollectionsidproducts).
 *
 * You can use this workflow within your own customizations or custom workflows to manage the products in a collection.
 *
 * @example
 * const { result } = await batchLinkProductsToCollectionWorkflow(container)
 * .run({
 *   input: {
 *     id: "pcol_123",
 *     add: ["prod_123"],
 *     remove: ["prod_456"],
 *   }
 * })
 *
 * @summary
 *
 * Manage the links between a collection and products.
 */
export const batchLinkProductsToCollectionWorkflow = createWorkflow(
  batchLinkProductsToCollectionWorkflowId,
  (input: WorkflowData<LinkWorkflowInput>): WorkflowData<void> => {
    batchLinkProductsToCollectionStep(input)
  }
)
