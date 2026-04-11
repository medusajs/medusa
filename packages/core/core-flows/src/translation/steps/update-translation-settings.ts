import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { UpdateTranslationSettingsDTO } from "@medusajs/types"

export const updateTranslationSettingsStepId = "update-translation-settings"

export type UpdateTranslationSettingsStepInput =
  | UpdateTranslationSettingsDTO
  | UpdateTranslationSettingsDTO[]

/**
 * This step updates translation settings based on the provided input.
 * It supports both single and multiple translation settings updates.
 * In case of failure, it compensates by restoring the previous translation settings.
 * 
 * @since 2.13.0
 * 
 * @example
 * const result = updateTranslationSettingsStep({
 *   id: "ts_123",
 *   fields: ["title", "description", "material"],
 *   is_active: false
 * })
 */
export const updateTranslationSettingsStep = createStep(
  updateTranslationSettingsStepId,
  async (data: UpdateTranslationSettingsStepInput, { container }) => {
    const service = container.resolve(Modules.TRANSLATION)

    const normalizedInput = Array.isArray(data) ? data : [data]

    const previous = await service.listTranslationSettings({
      id: normalizedInput.map((d) => d.id),
    })

    const updated = await service.updateTranslationSettings(normalizedInput)

    return new StepResponse(updated, previous)
  },
  async (previous, { container }) => {
    if (!previous?.length) {
      return
    }

    const service = container.resolve(Modules.TRANSLATION)

    await service.updateTranslationSettings(previous)
  }
)
