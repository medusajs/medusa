export const defaultAdminProductsVariantFields = [
  "id",
  "product_id",
  "title",
  "sku",
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
  "*prices",
  "prices.price_rules.value",
  "prices.price_rules.attribute",
  "*options",
]

export const retrieveVariantConfig = {
  defaults: defaultAdminProductsVariantFields,
  isList: false,
}

export const listVariantConfig = {
  ...retrieveVariantConfig,
  defaultLimit: 50,
  isList: true,
}

export const defaultAdminProductsOptionFields = ["id", "title"]

export const retrieveOptionConfig = {
  defaults: defaultAdminProductsOptionFields,
  isList: false,
}

export const listOptionConfig = {
  ...retrieveOptionConfig,
  defaultLimit: 50,
  isList: true,
}

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
  "*type",
  "*collection",
  "*options",
  "*options.values",
  "*tags",
  "*images",
  "*variants",
  "*variants.prices",
  "variants.prices.price_rules.value",
  "variants.prices.price_rules.attribute",
  "*variants.options",
  "*sales_channels",
]

export const retrieveProductQueryConfig = {
  defaults: defaultAdminProductFields,
  isList: false,
}

export const listProductQueryConfig = {
  ...retrieveProductQueryConfig,
  defaultLimit: 50,
  isList: true,
}
