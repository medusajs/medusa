import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createProductVariantsStep } from "../steps"

type WorkflowInput = {
  product_variants: ProductTypes.CreateProductVariantDTO[]
}

export const createProductVariantsWorkflowId = "create-product-variants"
export const createProductVariantsWorkflow = createWorkflow(
  createProductVariantsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductVariantDTO[]> => {
    return createProductVariantsStep(input.product_variants)
  }
)
