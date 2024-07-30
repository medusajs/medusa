import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createCollectionsStep } from "../steps"

type WorkflowInput = { collections: ProductTypes.CreateProductCollectionDTO[] }

export const createCollectionsWorkflowId = "create-collections"
export const createCollectionsWorkflow = createWorkflow(
  createCollectionsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<ProductTypes.ProductCollectionDTO[]>> => {
    return new WorkflowResponse(createCollectionsStep(input.collections))
  }
)
