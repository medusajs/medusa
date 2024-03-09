import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateProductsStep } from "../steps"

type UpdateProductsStepInput = {
  selector: ProductTypes.FilterableProductProps
  update: ProductTypes.UpdateProductDTO
}

type WorkflowInput = UpdateProductsStepInput

export const updateProductsWorkflowId = "update-products"
export const updateProductsWorkflow = createWorkflow(
  updateProductsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductDTO[]> => {
    return updateProductsStep(input)
  }
)
