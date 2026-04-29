import { TranslationDTO } from "@medusajs/framework/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { updateTranslationsStep, UpdateTranslationsStepInput } from "../steps"
import { TranslationWorkflowEvents } from "@medusajs/framework/utils"

/**
 * The translations to update.
 */
export type UpdateTranslationsWorkflowInput = UpdateTranslationsStepInput

export const updateTranslationsWorkflowId = "update-translations"
/**
 * This workflow updates translations matching the specified filters or IDs. It's used by other
 * workflows like the {@link batchTranslationsWorkflow} workflow.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to update translations in your custom flows.
 *
 * @since 2.12.3
 * @featureFlag translation
 *
 * @example
 * To update translations by their IDs:
 *
 * ```ts
 * const { result } = await updateTranslationsWorkflow(container)
 * .run({
 *   input: {
 *     translations: [
 *       { id: "trans_123", translations: { title: "Nouveau titre" } }
 *     ]
 *   }
 * })
 * ```
 *
 * To update translations matching filters:
 *
 * ```ts
 * const { result } = await updateTranslationsWorkflow(container)
 * .run({
 *   input: {
 *     selector: { reference_id: "prod_123", locale: "fr-FR" },
 *     update: { translations: { title: "Nouveau titre" } }
 *   }
 * })
 * ```
 *
 * @summary
 *
 * Update translations.
 */
export const updateTranslationsWorkflow = createWorkflow(
  updateTranslationsWorkflowId,
  (
    input: WorkflowData<UpdateTranslationsWorkflowInput>
  ): WorkflowResponse<TranslationDTO[]> => {
    const translations = updateTranslationsStep(input)

    const translationIdEvents = transform(
      { translations },
      ({ translations }) => {
        return translations?.map((t) => {
          return { id: t.id }
        })
      }
    )

    emitEventStep({
      eventName: TranslationWorkflowEvents.UPDATED,
      data: translationIdEvents,
    })

    return new WorkflowResponse(translations)
  }
)
