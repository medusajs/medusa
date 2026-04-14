export const defaults = [
  "id",
  "value",
  "external_id",
  "created_at",
  "updated_at",
  "metadata",
  "*products",
]

export const retrieveProductTypeConfig = {
  defaults,
  isList: false,
}

export const listProductTypeConfig = {
  defaults,
  defaultLimit: 50,
  isList: true,
}
