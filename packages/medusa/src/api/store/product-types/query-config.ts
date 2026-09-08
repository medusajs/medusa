import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaults = [
  "id",
  "value",
  "external_id",
  "created_at",
  "updated_at",
  "metadata",
  "*products",
]

export const retrieveProductTypeConfig = {
  defaults,
  disallowed: disallowedStoreFields,
  isList: false,
}

export const listProductTypeConfig = {
  defaults,
  disallowed: disallowedStoreFields,
  defaultLimit: 50,
  isList: true,
}
