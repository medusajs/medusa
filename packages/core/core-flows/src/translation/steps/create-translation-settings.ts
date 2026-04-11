import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CreateTranslationSettingsDTO } from "@medusajs/types"

export const createTranslationSettingsStepId = "create-translation-settings"

export type CreateTranslationSettingsStepInput =
  | CreateTranslationSettingsDTO
  | CreateTranslationSettingsDTO[]

/**
 * This step creates translation settings based on the provided input.
 * It supports both single and multiple translation settings creation.
 * In case of failure, it compensates by deleting the created translation settings.
 * 
 * @since 2.13.0
 * 
 * @example
 * const result = createTranslationSettingsStep({
 *   entity_type: "product",
 *   fields: ["title", "description", "material"],
 *   is_active: true
 * })
 */
export const createTranslationSettingsStep = createStep(
  createTranslationSettingsStepId,
  async (data: CreateTranslationSettingsStepInput, { container }) => {
    const service = container.resolve(Modules.TRANSLATION)

    const normalizedInput = Array.isArray(data) ? data : [data]

    const created = await service.createTranslationSettings(normalizedInput)

    return new StepResponse(
      created,
      created.map((translationSettings) => translationSettings.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve(Modules.TRANSLATION)

    await service.deleteTranslationSettings(createdIds)
  }
)
