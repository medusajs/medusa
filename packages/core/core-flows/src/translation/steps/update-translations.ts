import {
  FilterableTranslationProps,
  ITranslationModuleService,
  UpdateTranslationDataDTO,
  UpdateTranslationDTO,
} from "@medusajs/framework/types"
import {
  MedusaError,
  MedusaErrorTypes,
  Modules,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update translations.
 */
export type UpdateTranslationsStepInput =
  | {
      /**
       * The filters to select the translations to update.
       */
      selector: FilterableTranslationProps
      /**
       * The data to update in the translations.
       */
      update: UpdateTranslationDataDTO
    }
  | {
    /**
     * The translations to update by ID.
     */
      translations: UpdateTranslationDTO[]
    }

export const updateTranslationsStepId = "update-translations"
/**
 * This step updates translations matching the specified filters or by ID.
 * 
 * @since 2.12.3
 * @featureFlag translation
 *
 * @example
 * To update translations by their ID:
 * 
 * ```ts
 * const data = updateTranslationsStep({
 *   translations: [
 *     { id: "trans_123", translations: { title: "Nouveau titre" } }
 *   ]
 * })
 * ```
 * 
 * To update translations matching filters:
 * 
 * ```ts
 * const data = updateTranslationsStep({
 *   selector: {
 *     reference_id: "prod_123",
 *     locale: "fr-FR"
 *   },
 *   update: {
 *     translations: { title: "Nouveau titre" }
 *   }
 * })
 * ```
 */
export const updateTranslationsStep = createStep(
  updateTranslationsStepId,
  async (data: UpdateTranslationsStepInput, { container }) => {
    const service = container.resolve<ITranslationModuleService>(
      Modules.TRANSLATION
    )

    if ("translations" in data) {
      if (data.translations.some((t) => !t.id)) {
        throw new MedusaError(
          MedusaErrorTypes.INVALID_DATA,
          "Translation ID is required when doing a batch update of translations"
        )
      }

      if (!data.translations.length) {
        return new StepResponse([], [])
      }

      const prevData = await service.listTranslations({
        id: data.translations.map((t) => t.id) as string[],
      })

      const translations = await service.updateTranslations(data.translations)
      return new StepResponse(translations, prevData)
    }

    const prevData = await service.listTranslations(data.selector, {
      select: [
        "id",
        "reference_id",
        "reference",
        "locale_code",
        "translations",
      ],
    })

    if (Object.keys(data.update).length === 0) {
      return new StepResponse(prevData, [])
    }

    const translations = await service.updateTranslations({
      selector: data.selector,
      data: data.update,
    })

    return new StepResponse(translations, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<ITranslationModuleService>(
      Modules.TRANSLATION
    )

    await service.updateTranslations(
      prevData.map((t) => ({
        id: t.id,
        reference_id: t.reference_id,
        reference: t.reference,
        locale_code: t.locale_code,
        translations: t.translations,
      }))
    )
  }
)
