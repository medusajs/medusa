import { Modules, ProductOptionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"

import { emitEventStep } from "../../common"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteProductOptionsStep } from "../steps"

/**
 * The data to delete one or more product options.
 */
export type DeleteProductOptionsWorkflowInput = {
  /**
   * The IDs of the options to delete.
   */
  ids: string[]
}

export const deleteProductOptionsWorkflowId = "delete-product-options"
/**
 * This workflow deletes one or more product options. It's used by the
 * [Delete Product Option Admin API Route](https://docs.medusajs.com/api/admin#products_deleteproductsidoptionsoption_id).
 *
 * This workflow has a hook that allows you to perform custom actions after the product options are deleted. For example,
 * you can delete custom records linked to the product colleciton.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product-option deletion.
 *
 * @example
 * const { result } = await deleteProductOptionsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["poption_123"],
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more product option.
 *
 * @property hooks.productOptionsDeleted - This hook is executed after the options are deleted. You can consume this hook to perform custom actions on the deleted options.
 */
export const deleteProductOptionsWorkflow = createWorkflow(
  deleteProductOptionsWorkflowId,
  (input: WorkflowData<DeleteProductOptionsWorkflowInput>) => {
    const deletedProductOptions = deleteProductOptionsStep(input.ids)
    const productOptionsDeleted = createHook("productOptionsDeleted", {
      ids: input.ids,
    })

    const optionIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    parallelize(
      removeRemoteLinkStep({
        [Modules.PRODUCT]: { product_option_id: input.ids },
      }),
      emitEventStep({
        eventName: ProductOptionWorkflowEvents.DELETED,
        data: optionIdEvents,
      })
    )

    return new WorkflowResponse(deletedProductOptions, {
      hooks: [productOptionsDeleted],
    })
  }
)
