import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultReturnFields = [
  "id",
  "order_id",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const allowedStoreReturnExtraFields = [
  "display_id",
  "items",
  "received_at",
  "created_by",
  "canceled_at",
  "requested_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultReturnFields,
  allowed: buildAllowedFields(
    defaultReturnFields,
    allowedStoreReturnExtraFields
  ),
  isList: false,
}
