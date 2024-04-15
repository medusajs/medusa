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

  "parent_category.id",
  "parent_category.name",
  "category_children.id",
  "category_children.name",
]

export const retrieveProductCategoryConfig = {
  defaults,
  isList: false,
}

export const listProductCategoryConfig = {
  defaults,
  defaultLimit: 50,
  isList: true,
}
