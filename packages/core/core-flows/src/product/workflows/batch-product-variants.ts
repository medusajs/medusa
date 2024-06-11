import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  ProductTypes,
  UpdateProductVariantWorkflowInputDTO,
  CreateProductVariantWorkflowInputDTO,
} from "@medusajs/types"
import { createProductVariantsWorkflow } from "./create-product-variants"
import { updateProductVariantsWorkflow } from "./update-product-variants"
import { deleteProductVariantsWorkflow } from "./delete-product-variants"

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
    const res = parallelize(
      createProductVariantsWorkflow.runAsStep({
        // TODO: fix this check, `input.create` is a proxy object so check will pass but wrong data will be send as an argument
        input: { product_variants: input.create ?? [] },
      }),
      updateProductVariantsWorkflow.runAsStep({
        input: { product_variants: input.update ?? [] },
      }),
      deleteProductVariantsWorkflow.runAsStep({
        input: { ids: input.delete ?? [] },
      })
    )

    return transform({ res, input }, (data) => {
      return {
        created: data.res[0],
        updated: data.res[1],
        deleted: {
          ids: data.input.delete ?? [],
          object: "product_variant",
          deleted: true,
        },
      }
    })
  }
)
