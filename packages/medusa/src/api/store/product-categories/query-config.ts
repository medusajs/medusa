import { buildAllowedFields } from "../utils/allowed-fields"

export const defaults = [
  "id",
  "name",
  "description",
  "handle",
  "rank",
  "external_id",
  "parent_category_id",
  "created_at",
  "updated_at",
  "metadata",
  "*parent_category",
  "*category_children",
]

export const allowedStoreProductCategoryExtraFields = [
  "products",
  "parent_category.parent_category",
]

export const retrieveProductCategoryConfig = {
  defaults,
  allowed: buildAllowedFields(defaults, allowedStoreProductCategoryExtraFields),
  isList: false,
}

export const listProductCategoryConfig = {
  defaults,
  allowed: buildAllowedFields(defaults, allowedStoreProductCategoryExtraFields),
  defaultLimit: 50,
  isList: true,
}
