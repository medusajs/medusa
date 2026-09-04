import { buildAllowedFields } from "../utils/allowed-fields"
import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaultStoreProductFields = [
  "id",
  "title",
  "subtitle",
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
  "*type",
  "*collection",
  "*options",
  "*options.values",
  "*tags",
  "*images",
  "*variants",
  "*variants.options",
]

export const allowedStoreProductExtraFields = [
  "metadata",
  "categories",
  "variants.calculated_price",
  "variants.inventory_quantity",
  "variants.manage_inventory",
  "variants.allow_backorder",
  "variants.images",
  "variants.thumbnail",
  "variants.options.option",
  "variants.inventory_items",
  "variants.inventory_items.inventory",
  "variants.prices",
]

export const retrieveProductQueryConfig = {
  defaults: defaultStoreProductFields,
  allowed: buildAllowedFields(
    defaultStoreProductFields,
    allowedStoreProductExtraFields
  ),
  disallowed: disallowedStoreFields,
  storeRelationsLimit: 4,
  isList: false,
}

export const listProductQueryConfig = {
  ...retrieveProductQueryConfig,
  defaultLimit: 50,
  isList: true,
}
