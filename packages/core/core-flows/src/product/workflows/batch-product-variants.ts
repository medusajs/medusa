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

/**
 * The product variants to manage.
 */
export interface BatchProductVariantsWorkflowInput extends BatchWorkflowInput<
  CreateProductVariantWorkflowInputDTO,
  UpdateProductVariantWorkflowInputDTO
> {}

/**
 * The result of managing the product variants.
 */
export interface BatchProductVariantsWorkflowOutput extends BatchWorkflowOutput<ProductTypes.ProductVariantDTO> {}

export const batchProductVariantsWorkflowId = "batch-product-variants"
/**
 * This workflow creates, updates, and deletes product variants. It's used by the 
 * [Manage Variants in a Product Admin API Route](https://docs.medusajs.com/api/admin/products/manage-variants-in-a-product).
 * 
 * You can use this workflow within your own customizations or custom workflows to manage the variants of a product. You can also
 * use this within a [seed script](https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts/seed-data) or in a custom import script.
 * 
 * @example
 * const { result } = await batchProductVariantsWorkflow(container)
 * .run({
 *   input: {
 *     create: [
 *       {
 *         title: "Small Shirt",
 *         product_id: "prod_123",
 *         options: {
 *           Size: "S"
 *         },
 *         prices: [
 *           {
 *             amount: 10,
 *             currency_code: "usd"
 *           }
 *         ]
 *       }
 *     ],
 *     update: [
 *       {
 *         id: "variant_123",
 *         title: "Red Pants"
 *       }
 *     ],
 *     delete: ["variant_321"]
 *   }
 * })
 * 
 * @summary
 * 
 * Create, update, and delete product variants.
 */
export const batchProductVariantsWorkflow = createWorkflow(
  batchProductVariantsWorkflowId,
  (
    input: WorkflowData<BatchProductVariantsWorkflowInput>
  ): WorkflowResponse<BatchProductVariantsWorkflowOutput> => {
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
