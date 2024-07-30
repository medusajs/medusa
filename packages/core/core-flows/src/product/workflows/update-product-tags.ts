import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductTagsStep } from "../steps"

type UpdateProductTagsStepInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
}

type WorkflowInput = UpdateProductTagsStepInput

export const updateProductTagsWorkflowId = "update-product-tags"
export const updateProductTagsWorkflow = createWorkflow(
  updateProductTagsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<ProductTypes.ProductTagDTO[]>> => {
    return new WorkflowResponse(updateProductTagsStep(input))
  }
)
