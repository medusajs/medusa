import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultStoreRegionFields = [
  "id",
  "name",
  "currency_code",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "*countries",
]

const nestedStoreRegionCountryFields = [
  "countries.id",
  "countries.iso_2",
  "countries.iso_3",
  "countries.num_code",
  "countries.name",
  "countries.display_name",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreRegionFields,
  allowed: buildAllowedFields(
    defaultStoreRegionFields,
    nestedStoreRegionCountryFields
  ),
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultStoreRegionFields,
  allowed: buildAllowedFields(
    defaultStoreRegionFields,
    nestedStoreRegionCountryFields
  ),
  defaultLimit: 20,
  isList: true,
}
