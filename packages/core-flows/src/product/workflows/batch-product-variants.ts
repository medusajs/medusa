import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { batchProductVariantsStep } from "../steps/batch-product-variants"
import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  ProductTypes,
  UpdateProductVariantWorkflowInputDTO,
  CreateProductVariantWorkflowInputDTO,
} from "@medusajs/types"

export const batchProductVariantsWorkflowId = "batch-product-variants"
export const batchProductVariantsWorkflow = createWorkflow(
  batchProductVariantsWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<
        CreateProductVariantWorkflowInputDTO,
        UpdateProductVariantWorkflowInputDTO
      >
    >
  ): WorkflowData<BatchWorkflowOutput<ProductTypes.ProductVariantDTO>> => {
    return batchProductVariantsStep(input)
  }
)
