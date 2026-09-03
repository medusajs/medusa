import { buildAllowedFields } from "../utils/allowed-fields"
import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaults = [
  "id",
  "title",
  "is_exclusive",
  "values.*",
  "created_at",
  "updated_at",
  "metadata",
]

export const retrieveProductOptionConfig = {
  defaults,
  allowed: buildAllowedFields(defaults),
  disallowed: disallowedStoreFields,
  isList: false,
}

export const listProductOptionConfig = {
  defaults,
  allowed: buildAllowedFields(defaults),
  disallowed: disallowedStoreFields,
  defaultLimit: 50,
  isList: true,
}
