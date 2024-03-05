export const defaultAdminProductRelations = [
  "variants",
  // TODO: Add in next iteration
  // "variants.prices",
  // TODO: See how this should be handled
  // "variants.options",
  "images",
  // TODO: What is this?
  // "profiles",
  "options",
  // TODO: See how this should be handled
  // "options.values",
  // TODO: Handle in next iteration
  // "tags",
  // "type",
  // "collection",
]
export const allowedAdminProductRelations = [...defaultAdminProductRelations]
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
  // TODO: Handle in next iteration
  // "collection_id",
  // "type_id",
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
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminProductFields,
  defaultRelations: defaultAdminProductRelations,
  allowedRelations: allowedAdminProductRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  defaultLimit: 50,
  isList: true,
}

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
]

export const defaultAdminProductsOptionFields = ["id", "title"]
