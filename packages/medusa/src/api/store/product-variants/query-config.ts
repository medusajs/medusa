import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaultStoreProductVariantFields = [
  "id",
  "title",
  "sku",
  "barcode",
  "ean",
  "upc",
  "allow_backorder",
  "manage_inventory",
  "variant_rank",
  "product_id",
  "thumbnail",
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
  "metadata",
  "*options",
  "*images",
  "product.id",
  "product.type_id",
]

export const retrieveProductVariantConfig = {
  defaults: defaultStoreProductVariantFields,
  disallowed: disallowedStoreFields,
  isList: false,
}

export const listProductVariantConfig = {
  ...retrieveProductVariantConfig,
  defaultLimit: 20,
  isList: true,
}
