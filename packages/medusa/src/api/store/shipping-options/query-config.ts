import { disallowedStoreFields } from "../utils/disallowed-fields"

export const defaultStoreShippingOptionsFields = [
  "id",
  "name",
  "price_type",
  "service_zone_id",
  "shipping_profile_id",
  "fulfillment_provider_id",
  "shipping_option_type_id",
  "metadata",
]

export const listTransformQueryConfig = {
  disallowed: disallowedStoreFields,
  defaultLimit: 20,
  isList: true,
}

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreShippingOptionsFields,
  disallowed: disallowedStoreFields,
  isList: false,
}
