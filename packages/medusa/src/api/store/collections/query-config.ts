import { buildAllowedFields } from "../utils/allowed-fields"

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
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 10,
  isList: true,
}
