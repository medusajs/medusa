import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateCollectionsStep } from "../steps"

type UpdateCollectionsStepInput = {
  selector: ProductTypes.FilterableProductCollectionProps
  update: ProductTypes.UpdateProductCollectionDTO
}

type WorkflowInput = UpdateCollectionsStepInput

export const updateCollectionsWorkflowId = "update-collections"
export const updateCollectionsWorkflow = createWorkflow(
  updateCollectionsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<ProductTypes.ProductCollectionDTO[]>> => {
    return new WorkflowResponse(updateCollectionsStep(input))
  }
)
