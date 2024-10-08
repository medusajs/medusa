export const defaults = [
  "id",
  "name",
  "description",
  "handle",
  "rank",
  "parent_category_id",
  "created_at",
  "updated_at",
  "metadata",
  "*parent_category",
  "*category_children",
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
