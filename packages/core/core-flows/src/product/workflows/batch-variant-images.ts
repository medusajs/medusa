import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { ProductVariantDTO } from "@medusajs/types"
import {
  addImagesToVariantStep,
  removeImagesFromVariantStep,
  updateProductVariantsStep,
} from "../steps"
import { useQueryGraphStep } from "../../common"

/**
 * The input for the batch variant-images workflow.
 */
export interface BatchVariantImagesWorkflowInput {
  /**
   * The ID of the variant to manage images for.
   */
  variant_id: string
  /**
   * The image IDs to add to the variant.
   */
  add?: string[]
  /**
   * The image IDs to remove from the variant.
   */
  remove?: string[]
}

/**
 * The result of the batch variant-images workflow.
 */
export interface BatchVariantImagesWorkflowOutput {
  /**
   * The image IDs that were added to the variant.
   */
  added: string[]
  /**
   * The image IDs that were removed from the variant.
   */
  removed: string[]
}

export const batchVariantImagesWorkflowId = "batch-variant-images"

/**
 * This workflow manages the association between product variants and images in bulk.
 * It's used by the [Batch Variant Images Admin API Route](https://docs.medusajs.com/api/admin/products/manage-images-of-product-variant).
 *
 * You can use this workflow within your own customizations or custom workflows to manage variant-image associations in bulk.
 * This is also useful when writing a [seed script](https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts/seed-data) or a custom import script.
 *
 * @since 2.11.2
 *
 * @example
 * const { result } = await batchVariantImagesWorkflow(container)
 * .run({
 *   input: {
 *     variant_id: "variant_123",
 *     add: ["img_123", "img_456"],
 *     remove: ["img_789"]
 *   }
 * })
 *
 * @summary
 *
 * Manage variant-image associations in bulk.
 */
export const batchVariantImagesWorkflow = createWorkflow(
  batchVariantImagesWorkflowId,
  (
    input: WorkflowData<BatchVariantImagesWorkflowInput>
  ): WorkflowResponse<BatchVariantImagesWorkflowOutput> => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        variant_id: data.input.variant_id,
        add: data.input.add ?? [],
        remove: data.input.remove ?? [],
      }
    })

    const res = parallelize(
      addImagesToVariantStep(normalizedInput),
      removeImagesFromVariantStep(normalizedInput)
    )

    const shouldUpdateVariantThumbnail = when(
      "images-removed",
      { normalizedInput },
      (data) => data.normalizedInput.remove.length > 0
    ).then(() => {
      const variantId = transform({ normalizedInput }, (data) => {
        return data.normalizedInput.variant_id
      })

      const { data: variant } = useQueryGraphStep({
        entity: "variant",
        fields: ["id", "thumbnail"],
        filters: {
          id: variantId,
        },
        options: {
          isList: false,
        },
      }).config({ name: "get-variant-thumbnail" })

      const removedImagesQuery = useQueryGraphStep({
        entity: "product_image",
        fields: ["id", "url"],
        filters: {
          id: normalizedInput.remove,
        },
      }).config({ name: "get-removed-images" })

      const shouldUpdateVariantThumbnail = transform(
        { removedImagesQuery, variant },
        (data) => {
          const urls =
            data.removedImagesQuery.data?.map((image) => image.url) ?? []
          return !!urls.includes((data.variant as ProductVariantDTO).thumbnail)
        }
      )

      return shouldUpdateVariantThumbnail
    })

    when(
      "should-update-variant-thumbnail",
      { shouldUpdateVariantThumbnail },
      (data) => !!data.shouldUpdateVariantThumbnail
    ).then(() =>
      updateProductVariantsStep({
        selector: { id: input.variant_id },
        update: { thumbnail: null },
      })
    )

    const response = transform({ res, input }, (data) => {
      return {
        added: data.res[0] ?? [],
        removed: data.res[1] ?? [],
      }
    })

    return new WorkflowResponse(response)
  }
)
