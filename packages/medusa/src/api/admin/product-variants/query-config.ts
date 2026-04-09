export enum Entities {
  product_variant = "product_variant",
}

export const defaultAdminProductVariantFields = [
  "id",
  "title",
  "sku",
  "thumbnail",
  "barcode",
  "ean",
  "upc",
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
  "metadata",
  "variant_rank",
  "product_id",
  "created_at",
  "updated_at",
  "deleted_at",
  "*product",
  "*prices",
  "*options",
  "prices.price_rules.value",
  "prices.price_rules.attribute",
]

export const retrieveProductVariantQueryConfig = {
  defaults: defaultAdminProductVariantFields,
  isList: false,
  entity: Entities.product_variant,
}

export const listProductVariantQueryConfig = {
  ...retrieveProductVariantQueryConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.product_variant,
}
