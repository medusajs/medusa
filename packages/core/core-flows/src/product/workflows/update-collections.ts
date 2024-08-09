import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
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
    const collectionsUpdated = createHook("collectionsUpdated", {
      additional_data: input.additional_data,
      collections: updatedCollections,
    })

    return new WorkflowResponse(updatedCollections, {
      hooks: [collectionsUpdated],
    })
  }
)
