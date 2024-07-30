import {
  WorkflowData,
  WorkflowResponse,
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
  ): WorkflowResponse<BatchWorkflowOutput<ProductTypes.ProductVariantDTO>> => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        create: data.input.create ?? [],
        update: data.input.update ?? [],
        delete: data.input.delete ?? [],
      }
    })

    const res = parallelize(
      createProductVariantsWorkflow.runAsStep({
        input: { product_variants: normalizedInput.create },
      }),
      updateProductVariantsWorkflow.runAsStep({
        input: { product_variants: normalizedInput.update },
      }),
      deleteProductVariantsWorkflow.runAsStep({
        input: { ids: normalizedInput.delete },
      })
    )

    const response = transform({ res, input }, (data) => {
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

    return new WorkflowResponse(response)
  }
)
