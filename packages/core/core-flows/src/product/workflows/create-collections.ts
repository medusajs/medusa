import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createCollectionsStep } from "../steps"

type WorkflowInput = { collections: ProductTypes.CreateProductCollectionDTO[] }

export const createCollectionsWorkflowId = "create-collections"
export const createCollectionsWorkflow = createWorkflow(
  createCollectionsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductCollectionDTO[]> => {
    return createCollectionsStep(input.collections)
  }
)
