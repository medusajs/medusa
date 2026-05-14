import { CreateTranslationDTO, TranslationDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createTranslationsStep } from "../steps"
import { TranslationWorkflowEvents } from "@medusajs/framework/utils"

/**
 * The translations to create.
 */
export type CreateTranslationsWorkflowInput = {
  /**
   * The translations to create.
   */
  translations: CreateTranslationDTO[]
}

export const createTranslationsWorkflowId = "create-translations"
/**
 * This workflow creates one or more translations. It's used by other workflows
 * like the {@link batchTranslationsWorkflow} workflow.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create translations in your custom flows.
 *
 * @since 2.12.3
 * @featureFlag translation
 *
 * @example
 * const { result } = await createTranslationsWorkflow(container)
 * .run({
 *   input: {
 *     translations: [
 *       {
 *         reference_id: "prod_123",
 *         reference: "product",
 *         locale: "fr-FR",
 *         translations: { title: "Produit", description: "Description du produit" }
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more translations.
 */
export const createTranslationsWorkflow = createWorkflow(
  createTranslationsWorkflowId,
  (
    input: WorkflowData<CreateTranslationsWorkflowInput>
  ): WorkflowResponse<TranslationDTO[]> => {
    const translations = createTranslationsStep(input.translations)

    const translationIdEvents = transform(
      { translations },
      ({ translations }) => {
        return translations.map((t) => {
          return { id: t.id }
        })
      }
    )

    emitEventStep({
      eventName: TranslationWorkflowEvents.CREATED,
      data: translationIdEvents,
    })

    return new WorkflowResponse(translations)
  }
)
