import { buildAllowedFields } from "../utils/allowed-fields"
import { disallowedStoreFields } from "../utils/disallowed-fields"

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
  disallowed: disallowedStoreFields,
  isList: false,
}
