import {
  Modules,
  ProductCollectionWorkflowEvents,
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
import { deleteCollectionsStep } from "../steps"

/**
 * The data to delete one or more product collections.
 */
export type DeleteCollectionsWorkflowInput = {
  /**
   * The IDs of the collections to delete.
   */
  ids: string[]
}

export const deleteCollectionsWorkflowId = "delete-collections"
/**
 * This workflow deletes one or more product collections. It's used by the
 * [Delete Product Collection Admin API Route](https://docs.medusajs.com/api/admin/collections/delete-a-collection).
 *
 * This workflow has a hook that allows you to perform custom actions after the product collections are deleted. For example,
 * you can delete custom records linked to the product colleciton.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product-collection deletion.
 *
 * @example
 * const { result } = await deleteCollectionsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["pcol_123"],
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more product collection.
 *
 * @property hooks.collectionsDeleted - This hook is executed after the collections are deleted. You can consume this hook to perform custom actions on the deleted collections.
 */
export const deleteCollectionsWorkflow = createWorkflow(
  deleteCollectionsWorkflowId,
  (input: WorkflowData<DeleteCollectionsWorkflowInput>) => {
    const deletedCollections = deleteCollectionsStep(input.ids)

    const collectionIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    parallelize(
      removeRemoteLinkStep({
        [Modules.PRODUCT]: { product_collection_id: input.ids },
      }),
      emitEventStep({
        eventName: ProductCollectionWorkflowEvents.DELETED,
        data: collectionIdEvents,
      })
    )

    const collectionsDeleted = createHook("collectionsDeleted", {
      ids: input.ids,
    })

    return new WorkflowResponse(deletedCollections, {
      hooks: [collectionsDeleted],
    })
  }
)
