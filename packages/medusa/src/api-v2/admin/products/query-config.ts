export const defaultAdminProductsVariantFields = [
  "id",
  "product_id",
  "title",
  "sku",
  "inventory_quantity",
  "allow_backorder",
  "manage_inventory",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
  "weight",
  "length",
  "height",
  "width",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "variant_rank",
  "ean",
  "upc",
  "barcode",
  "prices.id",
  "prices.currency_code",
  "prices.amount",
  "prices.created_at",
  "prices.updated_at",
  "options.id",
  "options.option_value.value",
  "options.option_value.option.title",
]

export const retrieveVariantConfig = {
  defaultFields: defaultAdminProductsVariantFields,
  defaultRelations: [],
  allowedRelations: [],
  isList: false,
}

export const listVariantConfig = {
  ...retrieveVariantConfig,
  defaultLimit: 50,
  isList: true,
}

export const defaultAdminProductsOptionFields = ["id", "title"]

export const retrieveOptionConfig = {
  defaultFields: defaultAdminProductsOptionFields,
  isList: false,
}

export const listOptionConfig = {
  ...retrieveVariantConfig,
  defaultLimit: 50,
  isList: true,
}

/* export const allowedAdminProductRelations = [
  "variants",
  // "variants.prices",
  "variants.options",
  "images",
  // TODO: What is this?
  // "profiles",
  "options",
  "options.values",
  "tags",
  "type",
  "collection",
]*/

// TODO: This is what we had in the v1 list. Do we still want to expand that much by default? Also this doesn't work in v2 it seems.
/* export const defaultAdminProductRelations = [
  "variants",
  // "variants.prices",
  // "variants.options",
  // "profiles",
  "images",
  "options",
  // "options.values",
  "tags",
  "type",
  "collection",
]*/

export const defaultAdminProductFields = [
  "id",
  "title",
  "subtitle",
  "status",
  "external_id",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "collection_id",
  "type_id",
  "weight",
  "length",
  "height",
  "width",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "type.id",
  "type.value",
  "type.metadata",
  "type.created_at",
  "type.updated_at",
  "type.deleted_at",
  "collection.id",
  "collection.title",
  "collection.handle",
  "collection.created_at",
  "collection.updated_at",
  "options.id",
  "options.product_id",
  "options.title",
  "options.values.id",
  "options.values.value",
  "options.created_at",
  "options.updated_at",
  "options.deleted_at",
  "tags.id",
  "tags.value",
  "tags.created_at",
  "tags.updated_at",
  "images.id",
  "images.url",
  "images.metadata",
  "images.created_at",
  "images.updated_at",
  "images.deleted_at",
  // TODO: Until we support wildcards we have to do something like this.
  ...defaultAdminProductsVariantFields.map((f) => `variants.${f}`),
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminProductFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 50,
  isList: true,
}
