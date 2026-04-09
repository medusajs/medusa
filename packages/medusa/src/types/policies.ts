/**
 * Default RBAC Policy Resources for Medusa
 *
 */

export interface DefaultPolicyResources {
  // Customer resources
  customer: "customer"
  customer_address: "customer_address"
  customer_group: "customer_group"

  // Inventory resources
  inventory_item: "inventory_item"
  inventory_level: "inventory_level"
  reservation_item: "reservation_item"
  stock_location: "stock_location"

  // Order resources
  order: "order"
  order_change: "order_change"
  order_claim: "order_claim"
  order_exchange: "order_exchange"
  return: "return"
  return_reason: "return_reason"
  credit_line: "credit_line"

  // Payment resources
  payment: "payment"
  payment_collection: "payment_collection"
  payment_method: "payment_method"
  payment_session: "payment_session"
  refund_reason: "refund_reason"
  capture: "capture"
  refund: "refund"

  // Pricing resources
  price_list: "price_list"
  price_preference: "price_preference"
  price: "price"
  price_set: "price_set"
  currency: "currency"

  // Product resources
  product: "product"
  product_variant: "product_variant"
  product_option: "product_option"
  product_option_value: "product_option_value"
  product_tag: "product_tag"
  product_type: "product_type"
  product_category: "product_category"
  product_collection: "product_collection"

  // Promotion resources
  campaign: "campaign"
  promotion: "promotion"

  // Region resources
  region: "region"

  // Store resources
  store: "store"
  store_locale: "store_locale"

  // Translation resources
  translation: "translation"
  translation_settings: "translation_settings"

  // Shipping resources
  shipping_option: "shipping_option"
  shipping_option_type: "shipping_option_type"
  shipping_profile: "shipping_profile"
  fulfillment: "fulfillment"
  fulfillment_provider: "fulfillment_provider"
  fulfillment_set: "fulfillment_set"
  service_zone: "service_zone"

  // System resources
  file: "file"
  notification: "notification"
  workflow_execution: "workflow_execution"

  // Tax resources
  tax_provider: "tax_provider"
  tax_rate: "tax_rate"
  tax_region: "tax_region"

  // User resources
  user: "user"
  api_key: "api_key"
  invite: "invite"

  rbac_role: "rbac_role"
}

export type DefaultResourceKey = keyof DefaultPolicyResources

export type DefaultResourceValue = DefaultPolicyResources[DefaultResourceKey]

declare global {
  var PolicyResource: DefaultPolicyResources & Record<string, string>
  var PolicyOperation: Record<string, string> & {
    readonly read: "read"
    readonly write: "write"
    readonly update: "update"
    readonly delete: "delete"
    readonly "*": "*"
    readonly ALL: "*"
  }
  var Policy: Record<
    string,
    { resource: string; operation: string; description?: string }
  >
}
