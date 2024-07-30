import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createProductTypesStep } from "../steps"

type WorkflowInput = { product_types: ProductTypes.CreateProductTypeDTO[] }

export const createProductTypesWorkflowId = "create-product-types"
export const createProductTypesWorkflow = createWorkflow(
  createProductTypesWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<ProductTypes.ProductTypeDTO[]> => {
    return new WorkflowResponse(createProductTypesStep(input.product_types))
  }
)
