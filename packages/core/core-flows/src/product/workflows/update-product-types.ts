import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductTypesStep } from "../steps"

type UpdateProductTypesStepInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
}

type WorkflowInput = UpdateProductTypesStepInput

export const updateProductTypesWorkflowId = "update-product-types"
export const updateProductTypesWorkflow = createWorkflow(
  updateProductTypesWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<ProductTypes.ProductTypeDTO[]>> => {
    return new WorkflowResponse(updateProductTypesStep(input))
  }
)
