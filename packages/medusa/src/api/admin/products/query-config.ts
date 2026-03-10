import { defaultAdminProductVariantFields } from "../product-variants/query-config"

export enum Entities {
  product = "product",
  product_option = "product_option",
  product_variant = "product_variant",
  inventory_item = "inventory_item",
  price = "price",
}

export const defaultAdminProductsVariantFields =
  defaultAdminProductVariantFields.filter((field) => field !== "*product")

export const retrieveVariantConfig = {
  defaults: defaultAdminProductsVariantFields,
  isList: false,
  entity: Entities.product_variant,
}

export const listVariantConfig = {
  ...retrieveVariantConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.product_variant,
}

export const defaultAdminProductsOptionFields = ["id", "title"]

export const retrieveOptionConfig = {
  defaults: defaultAdminProductsOptionFields,
  isList: false,
  entity: Entities.product_option,
}

export const listOptionConfig = {
  ...retrieveOptionConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.product_option,
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
  entity: Entities.product,
}

export const listProductQueryConfig = {
  ...retrieveProductQueryConfig,
  defaultLimit: 50,
  isList: true,
  entity: Entities.product,
}
