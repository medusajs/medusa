import { ITranslationModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The IDs of the translations to delete.
 */
export type DeleteTranslationsStepInput = string[]

export const deleteTranslationsStepId = "delete-translations"
/**
 * This step deletes one or more translations.
 * 
 * @since 2.12.3
 * @featureFlag translation
 *
 * @example
 * const data = deleteTranslationsStep([
 *   "trans_123",
 *   "trans_456",
 * ])
 */
export const deleteTranslationsStep = createStep(
  deleteTranslationsStepId,
  async (ids: DeleteTranslationsStepInput, { container }) => {
    const service = container.resolve<ITranslationModuleService>(
      Modules.TRANSLATION
    )

    await service.softDeleteTranslations(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<ITranslationModuleService>(
      Modules.TRANSLATION
    )

    await service.restoreTranslations(prevIds)
  }
)
