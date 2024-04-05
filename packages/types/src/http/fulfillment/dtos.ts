import { GeoZoneType, ShippingOptionPriceType } from "../../fulfillment"

/**
 * @experimental
 */
export interface FulfillmentSetDTO {
  id: string
  name: string
  type: string
  metadata: Record<string, unknown> | null
  service_zones: ServiceZoneDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface ServiceZoneDTO {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  fulfillment_sets: FulfillmentSetDTO[]
  geo_zones: GeoZoneDTO[]
  shipping_options: ShippingOptionDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface GeoZoneDTO {
  id: string
  type: GeoZoneType
  country_code: string
  province_code: string | null
  city: string | null
  postal_expression: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface ShippingOptionDTO {
  id: string
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  shipping_profile_id: string
  provider_id: string
  shipping_option_type_id: string | null
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  service_zone: ServiceZoneDTO
  shipping_profile: ShippingProfileDTO
  fulfillment_provider: FulfillmentProviderDTO
  type: ShippingOptionTypeDTO
  rules: ShippingOptionRuleDTO[]
  fulfillments: FulfillmentDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface ShippingOptionTypeDTO {
  id: string
  label: string
  description: string
  code: string
  shipping_option_id: string
  shipping_option: ShippingOptionDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface ShippingProfileDTO {
  id: string
  name: string
  type?: string
  metadata?: Record<string, unknown>
}

/**
 * @experimental
 */
export interface ShippingOptionRuleDTO {
  id: string
  attribute: string
  operator: string
  value: { value: string | string[] } | null
  shipping_option_id: string
  shipping_option: ShippingOptionDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface FulfillmentDTO {
  id: string
  location_id: string
  packed_at: Date | null
  shipped_at: Date | null
  delivered_at: Date | null
  canceled_at: Date | null
  data: Record<string, unknown> | null
  provider_id: string
  shipping_option_id: string | null
  metadata: Record<string, unknown> | null
  shipping_option: ShippingOptionDTO | null
  provider: FulfillmentProviderDTO
  delivery_address: FulfillmentAddressDTO
  items: FulfillmentItemDTO[]
  labels: FulfillmentLabelDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface FulfillmentProviderDTO {
  id: string
  name: string
  metadata: Record<string, unknown> | null
  shipping_options: ShippingOptionDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface FulfillmentItemDTO {
  id: string
  title: string
  quantity: number
  sku: string
  barcode: string
  line_item_id: string | null
  inventory_item_id: string | null
  fulfillment_id: string
  fulfillment: FulfillmentDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface FulfillmentLabelDTO {
  id: string
  tracking_number: string
  tracking_url: string
  label_url: string
  fulfillment_id: string
  fulfillment: FulfillmentDTO
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

/**
 * @experimental
 */
export interface FulfillmentAddressDTO {
  id: string
  fulfillment_id: string | null
  company: string | null
  first_name: string | null
  last_name: string | null
  address_1: string | null
  address_2: string | null
  city: string | null
  country_code: string | null
  province: string | null
  postal_code: string | null
  phone: string | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
