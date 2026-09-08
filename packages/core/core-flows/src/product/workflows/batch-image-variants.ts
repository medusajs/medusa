import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { ProductTypes } from "@medusajs/framework/types"
import {
  addImageToVariantsStep,
  removeImageFromVariantsStep,
  updateProductVariantsStep,
} from "../steps"
import { useQueryGraphStep } from "../../common"

/**
 * The input for the batch image-variant workflow.
 */
export interface BatchImageVariantsWorkflowInput {
  /**
   * The ID of the image to manage variants for.
   */
  image_id: string
  /**
   * The variant IDs to add to the image.
   */
  add?: string[]
  /**
   * The variant IDs to remove from the image.
   */
  remove?: string[]
}

/**
 * The result of the batch image-variant workflow.
 */
export interface BatchImageVariantsWorkflowOutput {
  /**
   * The variant IDs that were added to the image.
   */
  added: string[]
  /**
   * The variant IDs that were removed from the image.
   */
  removed: string[]
}

export const batchImageVariantsWorkflowId = "batch-image-variants"

/**
 * This workflow manages the association between product images and variants in bulk.
 * It's used by the [Batch Image Variants Admin API Route](https://docs.medusajs.com/api/admin/products/manage-variants-of-product-image).
 *
 * You can use this workflow within your own customizations or custom workflows to manage image-variant associations in bulk.
 * This is also useful when writing a [seed script](https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts/seed-data) or a custom import script.
 *
 * @since 2.11.2
 *
 * @example
 * const { result } = await batchImageVariantsWorkflow(container)
 * .run({
 *   input: {
 *     image_id: "img_123",
 *     add: ["variant_123", "variant_456"],
 *     remove: ["variant_789"]
 *   }
 * })
 *
 * @summary
 *
 * Manage image-variant associations in bulk.
 */
export const batchImageVariantsWorkflow = createWorkflow(
  batchImageVariantsWorkflowId,
  (
    input: WorkflowData<BatchImageVariantsWorkflowInput>
  ): WorkflowResponse<BatchImageVariantsWorkflowOutput> => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        image_id: data.input.image_id,
        add: data.input.add ?? [],
        remove: data.input.remove ?? [],
      }
    })

    const res = parallelize(
      addImageToVariantsStep(normalizedInput),
      removeImageFromVariantsStep(normalizedInput)
    )

    const updateData = when(
      "should-remove-variants",
      { normalizedInput },
      (data) => data.normalizedInput.remove.length > 0
    ).then(() => {
      const imageId = transform({ normalizedInput }, (data) => {
        return data.normalizedInput.image_id
      })

      const variantsQuery = useQueryGraphStep({
        entity: "variants",
        fields: ["id", "thumbnail"],
        filters: {
          id: normalizedInput.remove,
        },
      }).config({ name: "get-variants-for-thumbnail-check" })

      const { data: image } = useQueryGraphStep({
        entity: "product_image",
        fields: ["id", "url"],
        filters: {
          id: imageId,
        },
        options: {
          isList: false,
        },
      }).config({ name: "get-image-for-thumbnail-check" })

      const updateData = transform(
        {
          variants: variantsQuery.data,
          image: image,
        },
        (data) => {
          const imageUrl =
            typeof data.image?.url === "string" ? data.image.url : null

          if (!imageUrl) {
            return null
          }

          return {
            selector: {
              id: normalizedInput.remove,
              thumbnail: imageUrl,
            },
            update: {
              thumbnail: null,
            },
          }
        }
      )

      return updateData
    })

    when(
      "should-update-variants",
      { updateData },
      (data) =>
        data.updateData !== null && typeof data.updateData !== "undefined"
    ).then(() => {
      updateProductVariantsStep(
        updateData! as {
          selector: ProductTypes.FilterableProductVariantProps
          update: ProductTypes.UpdateProductVariantDTO
        }
      )
    })

    const response = transform({ res, input }, (data) => {
      return {
        added: data.res[0] ?? [],
        removed: data.res[1] ?? [],
      }
    })

    return new WorkflowResponse(response)
  }
)
