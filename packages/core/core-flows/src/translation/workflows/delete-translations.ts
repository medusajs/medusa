import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { deleteTranslationsStep } from "../steps"
import { TranslationWorkflowEvents } from "@medusajs/framework/utils"

/**
 * The IDs of the translations to delete.
 */
export type DeleteTranslationsWorkflowInput = {
  /**
   * The IDs of the translations to delete.
   */
  ids: string[]
}

export const deleteTranslationsWorkflowId = "delete-translations"
/**
 * This workflow deletes one or more translations. It's used by other
 * workflows like the {@link batchTranslationsWorkflow} workflow.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete translations in your custom flows.
 * 
 * @since 2.12.3
 * @featureFlag translation
 *
 * @example
 * const { result } = await deleteTranslationsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["trans_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more translations.
 */
export const deleteTranslationsWorkflow = createWorkflow(
  deleteTranslationsWorkflowId,
  (
    input: WorkflowData<DeleteTranslationsWorkflowInput>
  ): WorkflowData<void> => {
    deleteTranslationsStep(input.ids)

    const translationIdEvents = transform({ input }, ({ input }) => {
      return input.ids?.map((id) => {
        return { id }
      })
    })

    emitEventStep({
      eventName: TranslationWorkflowEvents.DELETED,
      data: translationIdEvents,
    })
  }
)
