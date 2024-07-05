import { ProductTypes } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateProductsStep } from "../steps/update-products"

type UpdateProductsStepInput =
  | {
      selector: ProductTypes.FilterableProductProps
      update: ProductTypes.UpdateProductDTO
    }
  | {
      products: ProductTypes.UpsertProductDTO[]
    }

type WorkflowInput = UpdateProductsStepInput

export const updateProductsWorkflowId = "update-products"
export const updateProductsWorkflow = createWorkflow(
  updateProductsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductDTO[]> => {
    // TODO: Delete price sets for removed variants
    // TODO Update sales channel links
    return updateProductsStep(input)
  }
)
