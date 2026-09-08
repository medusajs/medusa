import { Modules, ProductTypeWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteProductTypesStep } from "../steps"

/**
 * The data to delete one or more product types.
 */
export type DeleteProductTypesWorkflowInput = {
  /**
   * The IDs of the types to delete.
   */
  ids: string[]
}

export const deleteProductTypesWorkflowId = "delete-product-types"
/**
 * This workflow deletes one or more product types. It's used by the
 * [Delete Product Types Admin API Route](https://docs.medusajs.com/api/admin/product-types/delete-a-product-type).
 *
 * This workflow has a hook that allows you to perform custom actions after the product types are deleted. For example,
 * you can delete custom records linked to the product types.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product-type deletion.
 *
 * @example
 * const { result } = await deleteProductTypesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["ptyp_123"],
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more product types.
 *
 * @property hooks.productTypesDeleted - This hook is executed after the types are deleted. You can consume this hook to perform custom actions on the deleted types.
 */
export const deleteProductTypesWorkflow = createWorkflow(
  deleteProductTypesWorkflowId,
  (input: WorkflowData<DeleteProductTypesWorkflowInput>) => {
    const deletedProductTypes = deleteProductTypesStep(input.ids)
    const productTypesDeleted = createHook("productTypesDeleted", {
      ids: input.ids,
    })

    const typeIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    parallelize(
      removeRemoteLinkStep({
        [Modules.PRODUCT]: { product_type_id: input.ids },
      }),
      emitEventStep({
        eventName: ProductTypeWorkflowEvents.DELETED,
        data: typeIdEvents,
      })
    )

    return new WorkflowResponse(deletedProductTypes, {
      hooks: [productTypesDeleted],
    })
  }
)
