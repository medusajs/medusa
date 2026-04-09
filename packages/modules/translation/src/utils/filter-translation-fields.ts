import { TranslationTypes } from "@medusajs/framework/types"

export function filterTranslationFields(
  translations: TranslationTypes.TranslationDTO[],
  translatableFieldsConfig: Record<string, string[]>
): TranslationTypes.TranslationDTO[] {
  return translations.map((translation) => {
    const allowedFields = translatableFieldsConfig[translation.reference]
    if (!allowedFields?.length) {
      translation.translations = {}
      return translation
    }

    const filteredTranslations: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (
        translation.translations &&
        field in (translation.translations as Record<string, unknown>)
      ) {
        filteredTranslations[field] = (
          translation.translations as Record<string, unknown>
        )[field]
      }
    }

    translation.translations = filteredTranslations
    return translation
  })
}
