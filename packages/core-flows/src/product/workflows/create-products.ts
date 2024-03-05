import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createProductsStep } from "../steps"

type WorkflowInput = { products: ProductTypes.CreateProductDTO[] }

export const createProductsWorkflowId = "create-products"
export const createProductsWorkflow = createWorkflow(
  createProductsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductDTO[]> => {
    return createProductsStep(input.products)
  }
)
