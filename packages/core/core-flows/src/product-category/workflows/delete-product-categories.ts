import {
  Modules,
  ProductCategoryWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, removeRemoteLinkStep } from "../../common"
import { deleteProductCategoriesStep } from "../steps"

/**
 * The IDs of product categories to delete.
 */
export type DeleteProductCategoriesWorkflowInput = string[]

export const deleteProductCategoriesWorkflowId = "delete-product-categories"
/**
 * This workflow deletes one or more product categories. It's used by the
 * [Delete Product Category Admin API Route](https://docs.medusajs.com/api/admin/product-categories/delete-a-product-category).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete product categories within your custom flows.
 *
 * A product category that has child categories can't be deleted. All the IDs passed as input are
 * validated and deleted as a single batch, so the input must not contain both a category and any of
 * its descendants. Ordering the input array deepest-first has no effect.
 *
 * To delete a category tree, group the IDs by depth and run this workflow once per depth level,
 * starting with the deepest level:
 *
 * ```ts
 * // idsByDepth is a Map of a depth level to the IDs of the categories at that level
 * for (const depth of [...idsByDepth.keys()].sort((a, b) => b - a)) {
 *   await deleteProductCategoriesWorkflow(container)
 *   .run({
 *     input: idsByDepth.get(depth)!
 *   })
 * }
 * ```
 *
 * @example
 * const { result } = await deleteProductCategoriesWorkflow(container)
 * .run({
 *   input: ["pcat_123"]
 * })
 *
 * @summary
 *
 * Delete product categories.
 *
 * @property hooks.categoriesDeleted - This hook is called after the product categories are deleted.
 * You can use it to perform custom actions on the deleted categories.
 */
export const deleteProductCategoriesWorkflow = createWorkflow(
  deleteProductCategoriesWorkflowId,
  (input: WorkflowData<DeleteProductCategoriesWorkflowInput>) => {
    const deleted = deleteProductCategoriesStep(input)

    const productCategoryIdEvents = transform({ input }, ({ input }) => {
      return input?.map((id) => {
        return { id }
      })
    })

    parallelize(
      removeRemoteLinkStep({
        [Modules.PRODUCT]: {
          product_category_id: input,
        },
      }),
      emitEventStep({
        eventName: ProductCategoryWorkflowEvents.DELETED,
        data: productCategoryIdEvents,
      })
    )

    const categoriesDeleted = createHook("categoriesDeleted", {
      ids: input,
    })

    return new WorkflowResponse(deleted, {
      hooks: [categoriesDeleted],
    })
  }
)
