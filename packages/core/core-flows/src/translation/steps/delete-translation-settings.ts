import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const deleteTranslationSettingsStepId = "delete-translation-settings"

/**
 * The IDs of the translation settings to be deleted.
 */
export type DeleteTranslationSettingsStepInput = string[]

/**
 * This step deletes translation settings based on the provided IDs.
 * It compensates by restoring the deleted translation settings in case of failure.
 * 
 * @since 2.13.0
 * 
 * @example
 * const result = deleteTranslationSettingsStep([
 *   "ts_123",
 *   "ts_456"
 * ])
 */
export const deleteTranslationSettingsStep = createStep(
  deleteTranslationSettingsStepId,
  async (data: DeleteTranslationSettingsStepInput, { container }) => {
    const service = container.resolve(Modules.TRANSLATION)

    const previous = await service.listTranslationSettings({
      id: data,
    })

    await service.deleteTranslationSettings(data)

    return new StepResponse(void 0, previous)
  },
  async (previous, { container }) => {
    if (!previous?.length) {
      return
    }

    const service = container.resolve(Modules.TRANSLATION)

    await service.createTranslationSettings(previous)
  }
)
