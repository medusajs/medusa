export enum Entities {
  product_category = "product_category",
}

export const defaults = [
  "id",
  "name",
  "description",
  "handle",
  "is_active",
  "is_internal",
  "rank",
  "external_id",
  "parent_category_id",
  "created_at",
  "updated_at",
  "metadata",
  "*parent_category",
  "*category_children",
]

const categoryScalarFields = [
  "id",
  "name",
  "description",
  "handle",
  "is_active",
  "is_internal",
  "rank",
  "external_id",
  "parent_category_id",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const allowed = [
  ...categoryScalarFields,
  "category_children",
  ...categoryScalarFields.map((field) => `category_children.${field}`),
  "parent_category",
  ...categoryScalarFields.map((field) => `parent_category.${field}`),
  "products",
  "translations",
]

export const retrieveProductCategoryConfig = {
  defaults,
  allowed,
  isList: false,
  entity: Entities.product_category,
}

export const listProductCategoryConfig = {
  defaults,
  allowed,
  defaultLimit: 50,
  isList: true,
  entity: Entities.product_category,
}
