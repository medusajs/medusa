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

const storeCategoryFields = [
  "id",
  "name",
  "description",
  "handle",
  "rank",
  "external_id",
  "parent_category_id",
  "created_at",
  "updated_at",
  "deleted_at",
]

const storeCategoryRelations = ["parent_category", "category_children"]

/**
 * A nested category is itself a category, so every level needs its own exact
 * paths. Capped at the framework's default `storeRelationsLimit` of 3 — a
 * deeper path would be rejected by `validateRelationsLimit` anyway.
 */
const buildNestedCategoryFields = (depth: number) => {
  const paths: string[] = []
  let prefixes = storeCategoryRelations

  for (let level = 1; level <= depth; level++) {
    if (level > 1) {
      paths.push(...prefixes)
    }

    for (const prefix of prefixes) {
      paths.push(...storeCategoryFields.map((field) => `${prefix}.${field}`))
    }

    prefixes = prefixes.flatMap((prefix) =>
      storeCategoryRelations.map((relation) => `${prefix}.${relation}`)
    )
  }

  return paths
}

export const allowedStoreProductCategoryExtraFields = [
  "products",
  "deleted_at",
  "products.title",
  "products.variants",
  "products.options",
  "products.images",
  "category_children.products.title",
  ...buildNestedCategoryFields(3),
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
