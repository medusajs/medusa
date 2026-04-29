import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CreateTranslationDTO, UpdateTranslationDTO } from "@medusajs/types"
import { createTranslationsWorkflow } from "./create-translations"
import { deleteTranslationsWorkflow } from "./delete-translations"
import { updateTranslationsWorkflow } from "./update-translations"

export const batchTranslationsWorkflowId = "batch-translations"

/**
 * The translations to manage.
 */
export type BatchTranslationsWorkflowInput = {
  /**
   * The translations to create.
   */
  create: CreateTranslationDTO[]
  /**
   * The translations to update.
   */
  update: UpdateTranslationDTO[]
  /**
   * The IDs of the translations to delete.
   */
  delete: string[]
}
/**
 * This workflow creates, updates, and deletes translations. It's used by the
 * [Manage Translations Admin API Route](https://docs.medusajs.com/api/admin#translations_posttranslationsbatch).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create, update, and delete translations in your custom flows.
 * 
 * @since 2.12.3
 * @featureFlag translation
 *
 * @example
 * const { result } = await batchTranslationsWorkflow(container)
 * .run({
 *   input: {
 *     create: [
 *       {
 *         reference_id: "prod_123",
 *         reference: "product",
 *         locale_code: "en-US",
 *         translations: {
 *           title: "Product Title",
 *           description: "Product Description",
 *         },
 *       }
 *     ],
 *     update: [
 *       {
 *         id: "trans_123",
 *         translations: {
 *           title: "Product Title",
 *           description: "Product Description",
 *         },
 *       }
 *     ],
 *     delete: ["trans_321"]
 *   }
 * })
 *
 * @summary
 *
 * Create, update, and delete translations.
 */
export const batchTranslationsWorkflow = createWorkflow(
  batchTranslationsWorkflowId,
  (input: BatchTranslationsWorkflowInput) => {
    const [created, updated, deleted] = parallelize(
      createTranslationsWorkflow.runAsStep({
        input: {
          translations: input.create,
        },
      }),
      updateTranslationsWorkflow.runAsStep({
        input: {
          translations: input.update,
        },
      }),
      deleteTranslationsWorkflow.runAsStep({
        input: {
          ids: input.delete,
        },
      })
    )

    return new WorkflowResponse(
      transform({ created, updated, deleted }, (result) => result)
    )
  }
)
