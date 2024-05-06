export const defaults = [
  "id",
  "name",
  "description",
  "handle",
  "is_active",
  "is_internal",
  "rank",
  "parent_category_id",
  "created_at",
  "updated_at",
  "metadata",
  "*parent_category",
  "*category_children",
]

export const allowed = [
  "id",
  "name",
  "description",
  "handle",
  "is_active",
  "is_internal",
  "rank",
  "parent_category_id",
  "created_at",
  "updated_at",
  "metadata",
  "category_children",
  "parent_category",
  "products",
]

export const retrieveProductCategoryConfig = {
  defaults,
  allowed,
  isList: false,
}

export const listProductCategoryConfig = {
  defaults,
  allowed,
  defaultLimit: 50,
  isList: true,
}
