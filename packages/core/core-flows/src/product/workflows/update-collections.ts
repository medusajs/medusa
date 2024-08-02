import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateCollectionsStep } from "../steps"

type UpdateCollectionsStepInput = {
  selector: ProductTypes.FilterableProductCollectionProps
  update: ProductTypes.UpdateProductCollectionDTO
  additional_data?: Record<string, unknown>
}

type WorkflowInput = UpdateCollectionsStepInput

export const updateCollectionsWorkflowId = "update-collections"
export const updateCollectionsWorkflow = createWorkflow(
  updateCollectionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
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
