import { buildAllowedFields } from "../../utils/allowed-fields"

export const defaultStoreProductSearchFields = [
  "id",
  "title",
  "subtitle",
  "description",
  "handle",
  "status",
  "collection_id",
  "type_id",
  "created_at",
  "updated_at",
]

export const searchProductQueryConfig = {
  defaults: defaultStoreProductSearchFields,
  allowed: buildAllowedFields(defaultStoreProductSearchFields),
  storeRelationsLimit: 4,
  defaultLimit: 20,
  isList: true,
}
