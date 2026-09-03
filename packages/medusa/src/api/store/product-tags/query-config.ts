import { buildAllowedFields } from "../utils/allowed-fields"
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

export const retrieveProductTagConfig = {
  defaults,
  allowed: buildAllowedFields(defaults),
  disallowed: disallowedStoreFields,
  isList: false,
}

export const listProductTagConfig = {
  defaults,
  allowed: buildAllowedFields(defaults),
  disallowed: disallowedStoreFields,
  defaultLimit: 50,
  isList: true,
}
