import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createCollectionsStep } from "../steps"

type WorkflowInput = {
  collections: ProductTypes.CreateProductCollectionDTO[]
  additional_data?: Record<string, unknown>
}

export const createCollectionsWorkflowId = "create-collections"
export const createCollectionsWorkflow = createWorkflow(
  createCollectionsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
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
