import { AdditionalData, ProductTypes } from "@medusajs/framework/types"
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

export type UpdateCollectionsWorkflowInput = {
  selector: ProductTypes.FilterableProductCollectionProps
  update: ProductTypes.UpdateProductCollectionDTO
} & AdditionalData

export const updateCollectionsWorkflowId = "update-collections"
/**
 * This workflow updates collections matching the specified filters.
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
