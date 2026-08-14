import { disallowedStoreFields } from "../utils/disallowed-fields"

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

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreRegionFields,
  disallowed: disallowedStoreFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultStoreRegionFields,
  disallowed: disallowedStoreFields,
  defaultLimit: 20,
  isList: true,
}
