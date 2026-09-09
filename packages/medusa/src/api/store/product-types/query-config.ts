import { buildAllowedFields } from "../utils/allowed-fields"

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
  allowed: buildAllowedFields(defaults),
  isList: false,
}

export const listProductTypeConfig = {
  defaults,
  allowed: buildAllowedFields(defaults),
  defaultLimit: 50,
  isList: true,
}
