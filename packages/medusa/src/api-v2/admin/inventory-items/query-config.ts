import { InventoryNext } from "@medusajs/types"
import { defaultAdminProductsVariantFields } from "../products/query-config"

// eslint-disable-next-line max-len
export const defaultAdminLocationLevelFields = [
  "id",
  "inventory_item_id",
  "location_id",
  "stocked_quantity",
  "reserved_quantity",
  "incoming_quantity",
  "available_quantity",
  "metadata",
  "created_at",
  "updated_at",
]

export const defaultAdminInventoryItemFields = [
  "id",
  "sku",
  "title",
  "description",
  "thumbnail",
  "origin_country",
  "hs_code",
  "requires_shipping",
  "mid_code",
  "material",
  "weight",
  "length",
  "height",
  "width",
  "metadata",
  "reserved_quantity",
  "stocked_quantity",
  "created_at",
  "updated_at",
  ...defaultAdminLocationLevelFields.map(
    (field) => `location_levels.${field.toString()}`
  ),
  ...defaultAdminProductsVariantFields
    .filter((field) => !field.startsWith("*"))
    .map((field) => `variant.${field}`),
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminInventoryItemFields,
  isList: false,
}

export const retrieveLocationLevelsTransformQueryConfig = {
  defaults: defaultAdminLocationLevelFields,
  isList: false,
}

export const listLocationLevelsTransformQueryConfig = {
  ...retrieveLocationLevelsTransformQueryConfig,
  isList: true,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
