import { disallowedStorePivotFields } from "../utils/disallowed-fields"

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
  disallowed: disallowedStorePivotFields,
  isList: false,
}
