import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { ProductTypes } from "@medusajs/types"
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

    // TODO: create inventory items
    // TODO: attach inventory items to product variants
  }
)
