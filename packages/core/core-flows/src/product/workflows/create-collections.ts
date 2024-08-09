import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
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
    const collectionsCreated = createHook("collectionsCreated", {
      collections,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(collections, {
      hooks: [collectionsCreated],
    })
  }
)
