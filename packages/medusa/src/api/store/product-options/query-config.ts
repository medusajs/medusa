import { buildAllowedFields } from "../utils/allowed-fields"

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
  isList: false,
}

export const listProductOptionConfig = {
  defaults,
  allowed: buildAllowedFields(defaults),
  defaultLimit: 50,
  isList: true,
}
