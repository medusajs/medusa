import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultStoreRetrieveReturnReasonFields = [
  "id",
  "value",
  "label",
  "parent_return_reason_id",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
  "*parent_return_reason",
  "*return_reason_children",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreRetrieveReturnReasonFields,
  allowed: buildAllowedFields(defaultStoreRetrieveReturnReasonFields),
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultStoreRetrieveReturnReasonFields,
  allowed: buildAllowedFields(defaultStoreRetrieveReturnReasonFields),
  defaultLimit: 20,
  isList: true,
}
