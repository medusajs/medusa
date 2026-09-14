import { buildAllowedFields } from "../utils/allowed-fields"

export const defaultStoreShippingOptionsFields = [
  "id",
  "name",
  "price_type",
  "service_zone_id",
  "shipping_profile_id",
  "provider_id",
  "shipping_option_type_id",
  "metadata",
]

export const allowedStoreShippingOptionExtraFields = [
  "data",

  "type",
  "type.id",
  "type.label",
  "type.description",
  "type.code",

  "provider",
  "provider.id",
  "provider.is_enabled",

  "prices",
  "prices.id",
  "prices.currency_code",
  "prices.amount",
  "prices.min_quantity",
  "prices.max_quantity",
  "prices.price_rules",
  "prices.price_rules.id",
  "prices.price_rules.attribute",
  "prices.price_rules.operator",
  "prices.price_rules.value",

  "calculated_price",
  "calculated_price.id",
  "calculated_price.currency_code",
  "calculated_price.calculated_amount",
  "calculated_price.calculated_amount_with_tax",
  "calculated_price.calculated_amount_without_tax",
  "calculated_price.original_amount",
  "calculated_price.original_amount_with_tax",
  "calculated_price.original_amount_without_tax",
  "calculated_price.is_calculated_price_price_list",
  "calculated_price.is_calculated_price_tax_inclusive",
  "calculated_price.is_original_price_price_list",
  "calculated_price.is_original_price_tax_inclusive",
  "calculated_price.calculated_price",
  "calculated_price.calculated_price.id",
  "calculated_price.calculated_price.price_list_id",
  "calculated_price.calculated_price.price_list_type",
  "calculated_price.calculated_price.min_quantity",
  "calculated_price.calculated_price.max_quantity",
  "calculated_price.original_price",
  "calculated_price.original_price.id",
  "calculated_price.original_price.price_list_id",
  "calculated_price.original_price.price_list_type",
  "calculated_price.original_price.min_quantity",
  "calculated_price.original_price.max_quantity",
]

export const allowedStoreShippingOptionListExtraFields = [
  ...allowedStoreShippingOptionExtraFields,

  "service_zone",
  "service_zone.id",
  "service_zone.fulfillment_set_id",
  "service_zone.fulfillment_set",
  "service_zone.fulfillment_set.id",
  "service_zone.fulfillment_set.type",
  "service_zone.fulfillment_set.location",
  "service_zone.fulfillment_set.location.id",
  "service_zone.fulfillment_set.location.address",
  "service_zone.fulfillment_set.location.address.id",
  "service_zone.fulfillment_set.location.address.company",
  "service_zone.fulfillment_set.location.address.address_1",
  "service_zone.fulfillment_set.location.address.address_2",
  "service_zone.fulfillment_set.location.address.city",
  "service_zone.fulfillment_set.location.address.country_code",
  "service_zone.fulfillment_set.location.address.province",
  "service_zone.fulfillment_set.location.address.postal_code",
  "service_zone.fulfillment_set.location.address.phone",
  "service_zone.fulfillment_set.location.address.metadata",
  "service_zone.fulfillment_set.location.address.created_at",
  "service_zone.fulfillment_set.location.address.updated_at",
  "service_zone.fulfillment_set.location.address.deleted_at",
]

export const listTransformQueryConfig = {
  allowed: buildAllowedFields(
    defaultStoreShippingOptionsFields,
    allowedStoreShippingOptionListExtraFields
  ),
  // listShippingOptionsForCartWorkflow always expands to
  // `service_zone.fulfillment_set.location.address.*`, so callers must be able
  // to name a path that deep.
  storeRelationsLimit: 4,
  defaultLimit: 20,
  isList: true,
}

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreShippingOptionsFields,
  allowed: buildAllowedFields(
    defaultStoreShippingOptionsFields,
    allowedStoreShippingOptionExtraFields
  ),
  isList: false,
}
