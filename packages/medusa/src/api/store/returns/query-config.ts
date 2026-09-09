import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultReturnFields = [
  "id",
  "order_id",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultReturnFields,
  allowed: buildAllowedFields(defaultReturnFields),
  isList: false,
}
