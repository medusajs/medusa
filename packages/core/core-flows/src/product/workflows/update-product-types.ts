import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
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
  ): WorkflowData<ProductTypes.ProductTypeDTO[]> => {
    return updateProductTypesStep(input)
  }
)
