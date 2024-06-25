import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  CreateProductWorkflowInputDTO,
  ProductTypes,
  UpdateProductWorkflowInputDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { createProductsWorkflow } from "./create-products"
import { deleteProductsWorkflow } from "./delete-products"
import { updateProductsWorkflow } from "./update-products"

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
    const res = parallelize(
      createProductsWorkflow.runAsStep({
        input: { products: input.create ?? [] },
      }),
      updateProductsWorkflow.runAsStep({
        input: { products: input.update ?? [] },
      }),
      deleteProductsWorkflow.runAsStep({
        input: { ids: input.delete ?? [] },
      })
    )

    return transform({ res, input }, (data) => {
      return {
        created: data.res[0],
        updated: data.res[1],
        deleted: {
          ids: data.input.delete ?? [],
          object: "product",
          deleted: true,
        },
      }
    })
  }
)
