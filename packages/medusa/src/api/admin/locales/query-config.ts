export enum Entities {
  store_locale = "store_locale",
}

export const defaultAdminLocaleFields = ["code", "name"]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminLocaleFields,
  isList: false,
  entity: Entities.store_locale,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 200,
  isList: true,
  entity: Entities.store_locale,
}
