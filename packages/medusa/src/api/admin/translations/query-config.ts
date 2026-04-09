export enum Entities {
  translation = "translation",
  translation_setting = "translation_setting",
}

export const defaultAdminTranslationFields = [
  "id",
  "reference_id",
  "reference",
  "locale_code",
  "translations",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminTranslationFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
