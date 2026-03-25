import { FeatureFlag } from "@medusajs/framework/utils"
import TranslationFeatureFlag from "../../../feature-flags/translation"

export enum Entities {
  store = "store",
}

export const defaultAdminStoreFields = [
  "id",
  "name",
  "*supported_currencies",
  "*supported_currencies.currency",
  ...(FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key)
    ? ["*supported_locales", "*supported_locales.locale"]
    : []),
  "default_sales_channel_id",
  "default_region_id",
  "default_location_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminStoreFields,
  isList: false,
  entity: Entities.store,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.store,
}
