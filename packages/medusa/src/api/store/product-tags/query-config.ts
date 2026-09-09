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

export const retrieveProductTagConfig = {
  defaults,
  allowed: buildAllowedFields(defaults),
  isList: false,
}

export const listProductTagConfig = {
  defaults,
  allowed: buildAllowedFields(defaults),
  defaultLimit: 50,
  isList: true,
}
