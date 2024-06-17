import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createProductTypesStep } from "../steps"

type WorkflowInput = { product_types: ProductTypes.CreateProductTypeDTO[] }

export const createProductTypesWorkflowId = "create-product-types"
export const createProductTypesWorkflow = createWorkflow(
  createProductTypesWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductTypeDTO[]> => {
    return createProductTypesStep(input.product_types)
  }
)
