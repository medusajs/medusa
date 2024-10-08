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
import { createCollectionsStep } from "../steps"

export type CreateCollectionsWorkflowInput = {
  collections: ProductTypes.CreateProductCollectionDTO[]
} & AdditionalData

export const createCollectionsWorkflowId = "create-collections"
/**
 * This workflow creates one or more collections.
 */
export const createCollectionsWorkflow = createWorkflow(
  createCollectionsWorkflowId,
  (input: WorkflowData<CreateCollectionsWorkflowInput>) => {
    const collections = createCollectionsStep(input.collections)

    const collectionIdEvents = transform({ collections }, ({ collections }) => {
      return collections.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductCollectionWorkflowEvents.CREATED,
      data: collectionIdEvents,
    })

    const collectionsCreated = createHook("collectionsCreated", {
      collections,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(collections, {
      hooks: [collectionsCreated],
    })
  }
)
