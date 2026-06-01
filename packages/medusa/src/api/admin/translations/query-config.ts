/**
 * Entity types for translation modules.
 */
export enum Entities {
  translation = "translation",
  translation_setting = "translation_setting",
}

/**
 * Default fields included when fetching admin translation records.
 */
export const defaultAdminTranslationFields = [
  "id",
  "reference_id",
  "reference",
  "locale_code",
  "translations",
]

/**
 * Query configuration for retrieving a single admin translation record.
 */
export const retrieveTransformQueryConfig = {
  defaults: defaultAdminTranslationFields,
  entity: Entities.translation,
  isList: false,
}

/**
 * Query configuration for listing admin translation records.
 */
export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
