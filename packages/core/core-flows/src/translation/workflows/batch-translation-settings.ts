import {
  createWorkflow,
  parallelize,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  UpdateTranslationSettingsDTO,
  CreateTranslationSettingsDTO,
} from "@medusajs/types"
import {
  createTranslationSettingsStep,
  deleteTranslationSettingsStep,
  updateTranslationSettingsStep,
} from "../steps"

export const batchTranslationSettingsWorkflowId = "batch-translation-settings"

/**
 * The translation settings to manage.
 */
export interface BatchTranslationSettingsWorkflowInput {
  /**
   * Translation settings to create.
   */
  create: CreateTranslationSettingsDTO[]
  /**
   * Translation settings to update.
   */
  update: UpdateTranslationSettingsDTO[]
  /**
   * Translation settings IDs to delete.
   */
  delete: string[]
}

/**
 * This workflow creates, updates, and deletes translation settings in batch.
 * It's used by the [List Translation Settings API route](https://docs.medusajs.com/api/admin#translations_gettranslationssettings).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create, update, and delete translation settings in your custom flows.
 *
 * @since 2.13.0
 * @featureFlag translation
 *
 * @example
 * const { result } = await batchTranslationSettingsWorkflow(container)
 * .run({
 *   create: [{
 *     entity_type: "product",
 *     fields: ["title", "description"],
 *     is_active: true
 *   }],
 *   update: [{
 *     id: "ts_123",
 *     is_active: false
 *   }],
 *   delete: ["ts_456"]
 * })
 *
 * @summary
 *
 * Create, update, and delete translation settings.
 */
export const batchTranslationSettingsWorkflow = createWorkflow(
  batchTranslationSettingsWorkflowId,
  (input: BatchTranslationSettingsWorkflowInput) => {
    const [created, updated, deleted] = parallelize(
      createTranslationSettingsStep(input.create),
      updateTranslationSettingsStep(input.update),
      deleteTranslationSettingsStep(input.delete)
    )

    return new WorkflowResponse({ created, updated, deleted })
  }
)
