import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateProductVariantsStep } from "../steps"

type UpdateProductVariantsStepInput = {
  selector: ProductTypes.FilterableProductVariantProps
  update: ProductTypes.UpdateProductVariantDTO
}

type WorkflowInput = UpdateProductVariantsStepInput

export const updateProductVariantsWorkflowId = "update-product-variants"
export const updateProductVariantsWorkflow = createWorkflow(
  updateProductVariantsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductVariantDTO[]> => {
    return updateProductVariantsStep(input)
  }
)
