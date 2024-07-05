import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { batchProductsStep } from "../steps/batch-products"
import {
  ProductTypes,
  BatchWorkflowInput,
  CreateProductWorkflowInputDTO,
  UpdateProductWorkflowInputDTO,
} from "@medusajs/types"
import { BatchWorkflowOutput } from "@medusajs/types/src"

export const batchProductsWorkflowId = "batch-products"
export const batchProductsWorkflow = createWorkflow(
  batchProductsWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<
        CreateProductWorkflowInputDTO,
        UpdateProductWorkflowInputDTO
      >
    >
  ): WorkflowData<BatchWorkflowOutput<ProductTypes.ProductDTO>> => {
    return batchProductsStep(input)
  }
)
