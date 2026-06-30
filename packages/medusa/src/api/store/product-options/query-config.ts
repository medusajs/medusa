export const defaults = [
  "id",
  "title",
  "is_exclusive",
  "values.*",
  "created_at",
  "updated_at",
  "metadata",
]

export const retrieveProductOptionConfig = {
  defaults,
  isList: false,
}

export const listProductOptionConfig = {
  defaults,
  defaultLimit: 50,
  isList: true,
}
