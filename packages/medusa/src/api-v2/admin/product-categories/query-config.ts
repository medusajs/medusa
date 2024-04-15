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

  "parent_category.id",
  "parent_category.name",
  "parent_category.handle",
  "parent_category.mpath",
  "parent_category.description",
  "parent_category.is_active",
  "parent_category.is_internal",
  "parent_category.rank",

  "category_children.id",
  "category_children.name",
  "category_children.handle",
  "category_children.mpath",
  "category_children.description",
  "category_children.is_active",
  "category_children.is_internal",
  "category_children.rank",
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
