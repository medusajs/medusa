import type { AdditionalData, ProductTypes } from "@medusajs/framework/types"
import { ProductCollectionWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { updateCollectionsStep } from "../steps"

/**
 * The data to update one or more product collections, along with custom data that's passed to the workflow's hooks.
 */
export type UpdateCollectionsWorkflowInput = {
  /**
   * The filters to select the collections to update.
   */
  selector: ProductTypes.FilterableProductCollectionProps
  /**
   * The data to update the collections with.
   */
  update: ProductTypes.UpdateProductCollectionDTO
} & AdditionalData

export const updateCollectionsWorkflowId = "update-collections"
/**
 * This workflow updates one or more collections. It's used by the
 * [Create Collection Admin API Route](https://docs.medusajs.com/api/admin/collections/update-a-collection).
 *
 * This workflow has a hook that allows you to perform custom actions on the updated collections. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the product collections.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around product-collection update.
 *
 * @example
 * const { result } = await updateCollectionsWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "pcol_123"
 *     },
 *     update: {
 *       title: "Summer Collection"
 *     },
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update one or more product collections.
 *
 * @property hooks.collectionsUpdated - This hook is executed after the collections are updated. You can consume this hook to perform custom actions on the updated collections.
 */
export const updateCollectionsWorkflow = createWorkflow(
  updateCollectionsWorkflowId,
  (input: WorkflowData<UpdateCollectionsWorkflowInput>) => {
    const updatedCollections = updateCollectionsStep(input)

    const collectionIdEvents = transform(
      { updatedCollections },
      ({ updatedCollections }) => {
        const arr = Array.isArray(updatedCollections)
          ? updatedCollections
          : [updatedCollections]

        return arr?.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductCollectionWorkflowEvents.UPDATED,
      data: collectionIdEvents,
    })

    const collectionsUpdated = createHook("collectionsUpdated", {
      additional_data: input.additional_data,
      collections: updatedCollections,
    })

    return new WorkflowResponse(updatedCollections, {
      hooks: [collectionsUpdated],
    })
  }
)
