import { buildAllowedFields } from "../utils/allowed-fields"
import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaultStoreCollectionFields = [
  "id",
  "title",
  "handle",
  "external_id",
  "created_at",
  "updated_at",
]

export const allowedStoreCollectionExtraFields = ["products", "metadata"]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreCollectionFields,
  allowed: buildAllowedFields(
    defaultStoreCollectionFields,
    allowedStoreCollectionExtraFields
  ),
  disallowed: disallowedStoreFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 10,
  isList: true,
}
