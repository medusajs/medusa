import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  BatchWorkflowInput,
  BatchWorkflowOutput,
  ProductTypes,
  UpdateProductVariantWorkflowInputDTO,
  CreateProductVariantWorkflowInputDTO,
} from "@medusajs/framework/types"
import { createProductVariantsWorkflow } from "./create-product-variants"
import { updateProductVariantsWorkflow } from "./update-product-variants"
import { deleteProductVariantsWorkflow } from "./delete-product-variants"

export const batchProductVariantsWorkflowId = "batch-product-variants"
/**
 * This workflow creates, updates, and deletes product variants.
 */
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
        deleted: data.input.delete ?? [],
      }
    })

    return new WorkflowResponse(response)
  }
)
