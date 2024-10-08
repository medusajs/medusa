export default `
enum GeoZoneType {
  country
  province
  city
  zip
}

enum ShippingOptionPriceType {
  calculated
  flat
}

type FulfillmentItem {
  id: ID!
  title: String!
  quantity: Int!
  sku: String!
  barcode: String!
  line_item_id: String
  inventory_item_id: String
  fulfillment_id: String!
  fulfillment: Fulfillment!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type FulfillmentLabel {
  id: ID!
  tracking_number: String!
  tracking_url: String!
  label_url: String!
  fulfillment_id: String!
  fulfillment: Fulfillment!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type FulfillmentProvider {
  id: ID!
  name: String!
  metadata: JSON
  shipping_options: [ShippingOption!]!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type FulfillmentSet {
  id: ID!
  name: String!
  type: String!
  metadata: JSON
  service_zones: [ServiceZone!]!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type Fulfillment {
  id: ID!
  location_id: String!
  packed_at: DateTime
  shipped_at: DateTime
  delivered_at: DateTime
  canceled_at: DateTime
  marked_shipped_by: String
  created_by: String
  data: JSON
  provider_id: String!
  shipping_option_id: String
  metadata: JSON
  shipping_option: ShippingOption
  provider: FulfillmentProvider!
  delivery_address: FulfillmentAddress!
  items: [FulfillmentItem!]!
  labels: [FulfillmentLabel!]!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type GeoZone {
  id: ID!
  type: GeoZoneType!
  country_code: String!
  province_code: String
  city: String
  postal_expression: JSON
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ServiceZone {
  id: ID!
  name: String!
  metadata: JSON
  fulfillment_set: FulfillmentSet!
  fulfillment_set_id: String!
  geo_zones: [GeoZone!]!
  shipping_options: [ShippingOption!]!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ShippingOptionRule {
  id: ID!
  attribute: String!
  operator: String!
  value: JSON
  shipping_option_id: String!
  shipping_option: ShippingOption!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ShippingOptionType {
  id: ID!
  label: String!
  description: String!
  code: String!
  shipping_option_id: String!
  shipping_option: ShippingOption!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ShippingOption {
  id: ID!
  name: String!
  price_type: ShippingOptionPriceType!
  service_zone_id: String!
  shipping_profile_id: String!
  provider_id: String!
  shipping_option_type_id: String
  data: JSON
  metadata: JSON
  service_zone: ServiceZone!
  shipping_profile: ShippingProfile!
  fulfillment_provider: FulfillmentProvider!
  type: ShippingOptionType!
  rules: [ShippingOptionRule!]!
  fulfillments: [Fulfillment!]!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

type ShippingProfile {
  id: ID!
  name: String!
  type: String!
  metadata: JSON
  shipping_options: [ShippingOption!]!
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

`
