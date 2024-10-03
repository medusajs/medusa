export default `
enum ChangeActionType {
  CANCEL_RETURN_ITEM
  FULFILL_ITEM
  CANCEL_ITEM_FULFILLMENT
  ITEM_ADD
  ITEM_REMOVE
  ITEM_UPDATE
  RECEIVE_DAMAGED_RETURN_ITEM
  RECEIVE_RETURN_ITEM
  RETURN_ITEM
  SHIPPING_ADD
  SHIPPING_REMOVE
  SHIP_ITEM
  WRITE_OFF_ITEM
  REINSTATE_ITEM
}

type OrderSummary {
  total: Float
  subtotal: Float
  total_tax: Float
  ordered_total: Float
  fulfilled_total: Float
  returned_total: Float
  return_request_total: Float
  write_off_total: Float
  projected_total: Float
  net_total: Float
  net_subtotal: Float
  net_total_tax: Float
  balance: Float
  paid_total: Float
  refunded_total: Float
  pending_difference: Float
  raw_pending_difference: JSON
}

type OrderShippingMethodAdjustment {
  id: ID!
  code: String
  amount: Float
  order_id: String!
  description: String
  promotion_id: String
  provider_id: String
  created_at: DateTime
  updated_at: DateTime
  shipping_method: OrderShippingMethod
  shipping_method_id: String!
}

type OrderLineItemAdjustment {
  id: ID!
  code: String
  amount: Float
  order_id: String!
  description: String
  promotion_id: String
  provider_id: String
  created_at: DateTime
  updated_at: DateTime
  item: OrderLineItem
  item_id: String!
}


type OrderShippingMethodTaxLine {
  id: ID!
  description: String
  tax_rate_id: String
  code: String!
  rate: Float
  provider_id: String
  created_at: DateTime
  updated_at: DateTime
  shipping_method: OrderShippingMethod
  shipping_method_id: String!
  total: Float
  subtotal: Float
  raw_total: JSON
  raw_subtotal: JSON
}

type OrderLineItemTaxLine {
  id: ID!
  description: String
  tax_rate_id: String
  code: String!
  rate: Float
  provider_id: String
  created_at: DateTime
  updated_at: DateTime
  item: OrderLineItem
  item_id: String!
  total: Float
  subtotal: Float
  raw_total: JSON
  raw_subtotal: JSON
}

type OrderAddress {
  id: ID!
  customer_id: String
  first_name: String
  last_name: String
  phone: String
  company: String
  address_1: String
  address_2: String
  city: String
  country_code: String
  province: String
  postal_code: String
  metadata: JSON
  created_at: DateTime
  updated_at: DateTime
}

type OrderShippingMethod {
  id: ID!
  order_id: String!
  name: String!
  description: String
  amount: Float
  raw_amount: JSON
  is_tax_inclusive: Boolean
  shipping_option_id: String
  data: JSON
  metadata: JSON
  tax_lines: [OrderShippingMethodTaxLine]
  adjustments: [OrderShippingMethodAdjustment]
  created_at: DateTime
  updated_at: DateTime
  original_total: Float
  original_subtotal: Float
  original_tax_total: Float
  total: Float
  subtotal: Float
  tax_total: Float
  discount_total: Float
  discount_tax_total: Float
  raw_original_total: JSON
  raw_original_subtotal: JSON
  raw_original_tax_total: JSON
  raw_total: JSON
  raw_subtotal: JSON
  raw_tax_total: JSON
  raw_discount_total: JSON
  raw_discount_tax_total: JSON
}

type OrderLineItem {
  id: ID!
  title: String!
  subtitle: String
  thumbnail: String
  variant_id: String
  product_id: String
  product_title: String
  product_description: String
  product_subtitle: String
  product_type: String
  product_collection: String
  product_handle: String
  variant_sku: String
  variant_barcode: String
  variant_title: String
  variant_option_values: JSON
  requires_shipping: Boolean!
  is_discountable: Boolean!
  is_tax_inclusive: Boolean!
  compare_at_unit_price: Float
  raw_compare_at_unit_price: JSON
  unit_price: Float!
  raw_unit_price: JSON
  quantity: Int!
  raw_quantity: JSON
  tax_lines: [OrderLineItemTaxLine]
  adjustments: [OrderLineItemAdjustment]
  detail: OrderItem!
  created_at: DateTime!
  updated_at: DateTime!
  metadata: JSON
  original_total: Float
  original_subtotal: Float
  original_tax_total: Float
  item_total: Float
  item_subtotal: Float
  item_tax_total: Float
  total: Float
  subtotal: Float
  tax_total: Float
  discount_total: Float
  discount_tax_total: Float
  refundable_total: Float
  refundable_total_per_unit: Float
  raw_original_total: JSON
  raw_original_subtotal: JSON
  raw_original_tax_total: JSON
  raw_item_total: JSON
  raw_item_subtotal: JSON
  raw_item_tax_total: JSON
  raw_total: JSON
  raw_subtotal: JSON
  raw_tax_total: JSON
  raw_discount_total: JSON
  raw_discount_tax_total: JSON
  raw_refundable_total: JSON
  raw_refundable_total_per_unit: JSON
}

type OrderItem {
  id: ID!
  item_id: String!
  item: OrderLineItem!
  quantity: Int!
  raw_quantity: JSON
  fulfilled_quantity: Int!
  raw_fulfilled_quantity: JSON
  shipped_quantity: Int!
  raw_shipped_quantity: JSON
  return_requested_quantity: Int!
  raw_return_requested_quantity: JSON
  return_received_quantity: Int!
  raw_return_received_quantity: JSON
  return_dismissed_quantity: Int!
  raw_return_dismissed_quantity: JSON
  written_off_quantity: Int!
  raw_written_off_quantity: JSON
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
}

enum OrderStatus {
  pending
  completed
  draft
  archived
  canceled
  requires_action
}

type Order {
  id: ID!
  version: Int!
  order_change: OrderChange
  status: OrderStatus!
  region_id: String
  customer_id: String
  sales_channel_id: String
  email: String
  currency_code: String!
  shipping_address: OrderAddress
  billing_address: OrderAddress
  items: [OrderLineItem]
  shipping_methods: [OrderShippingMethod]
  transactions: [OrderTransaction]
  summary: OrderSummary
  metadata: JSON
  canceled_at: DateTime
  created_at: DateTime!
  updated_at: DateTime!
  original_item_total: Float!
  original_item_subtotal: Float!
  original_item_tax_total: Float!
  item_total: Float!
  item_subtotal: Float!
  item_tax_total: Float!
  original_total: Float!
  original_subtotal: Float!
  original_tax_total: Float!
  total: Float!
  subtotal: Float!
  tax_total: Float!
  discount_total: Float!
  discount_tax_total: Float!
  gift_card_total: Float!
  gift_card_tax_total: Float!
  shipping_total: Float!
  shipping_subtotal: Float!
  shipping_tax_total: Float!
  original_shipping_total: Float!
  original_shipping_subtotal: Float!
  original_shipping_tax_total: Float!
  raw_original_item_total: JSON
  raw_original_item_subtotal: JSON
  raw_original_item_tax_total: JSON
  raw_item_total: JSON
  raw_item_subtotal: JSON
  raw_item_tax_total: JSON
  raw_original_total: JSON
  raw_original_subtotal: JSON
  raw_original_tax_total: JSON
  raw_total: JSON
  raw_subtotal: JSON
  raw_tax_total: JSON
  raw_discount_total: JSON
  raw_discount_tax_total: JSON
  raw_gift_card_total: JSON
  raw_gift_card_tax_total: JSON
  raw_shipping_total: JSON
  raw_shipping_subtotal: JSON
  raw_shipping_tax_total: JSON
  raw_original_shipping_total: JSON
  raw_original_shipping_subtotal: JSON
  raw_original_shipping_tax_total: JSON
}

enum ReturnStatus {
  requested
  received
  partially_received
  canceled
}

type Return {
  id: ID!
  status: ReturnStatus!
  refund_amount: Float
  order_id: String!
  items: [OrderReturnItem]!
}

type OrderReturnItem {
  id: ID!
  return_id: String!
  order_id: String!
  item_id: String!
  reason_id: String
  quantity: Int!
  raw_quantity: JSON
  received_quantity: Int
  raw_received_quantity: JSON
  metadata: JSON
  created_at: DateTime
  updated_at: DateTime
}

type OrderClaimItem {
  id: ID!
  claim_id: String!
  order_id: String!
  item_id: String!
  quantity: Int!
  reason: ClaimReason!
  images: [OrderClaimItemImage]
  raw_quantity: JSON
  metadata: JSON
  created_at: DateTime
  updated_at: DateTime
}

type OrderClaimItemImage {
  id: ID!
  claim_item_id: String!
  item: OrderClaimItem!
  url: String
  metadata: JSON
  created_at: DateTime
  updated_at: DateTime
}

type OrderExchangeItem {
  id: ID!
  exchange_id: String!
  order_id: String!
  item_id: String!
  quantity: Int!
  raw_quantity: JSON
  metadata: JSON
  created_at: DateTime
  updated_at: DateTime
}

type OrderClaim {
  order_id: String!
  claim_items: [OrderClaimItem]!
  additional_items: [OrderClaimItem]!
  return: Return
  return_id: String
  no_notification: Boolean
  refund_amount: Float
  created_by: String
}

type OrderExchange {
  order_id: String!
  return_items: [OrderReturnItem]!
  additional_items: [OrderExchangeItem]!
  no_notification: Boolean
  difference_due: Float
  return: Return
  return_id: String
  created_by: String
}

enum PaymentStatus {
  not_paid
  awaiting
  authorized
  partially_authorized
  captured
  partially_captured
  partially_refunded
  refunded
  canceled
  requires_action
}

enum FulfillmentStatus {
  not_fulfilled
  partially_fulfilled
  fulfilled
  partially_shipped
  shipped
  partially_delivered
  delivered
  canceled
}

type OrderDetail {
  id: ID!
  version: Int!
  order_change: OrderChange
  status: OrderStatus!
  region_id: String
  customer_id: String
  sales_channel_id: String
  email: String
  currency_code: String!
  shipping_address: OrderAddress
  billing_address: OrderAddress
  items: [OrderLineItem]
  shipping_methods: [OrderShippingMethod]
  transactions: [OrderTransaction]
  summary: OrderSummary
  metadata: JSON
  canceled_at: DateTime
  created_at: DateTime!
  updated_at: DateTime!
  original_item_total: Float!
  original_item_subtotal: Float!
  original_item_tax_total: Float!
  item_total: Float!
  item_subtotal: Float!
  item_tax_total: Float!
  original_total: Float!
  original_subtotal: Float!
  original_tax_total: Float!
  total: Float!
  subtotal: Float!
  tax_total: Float!
  discount_total: Float!
  discount_tax_total: Float!
  gift_card_total: Float!
  gift_card_tax_total: Float!
  shipping_total: Float!
  shipping_subtotal: Float!
  shipping_tax_total: Float!
  original_shipping_total: Float!
  original_shipping_subtotal: Float!
  original_shipping_tax_total: Float!
  raw_original_item_total: JSON
  raw_original_item_subtotal: JSON
  raw_original_item_tax_total: JSON
  raw_item_total: JSON
  raw_item_subtotal: JSON
  raw_item_tax_total: JSON
  raw_original_total: JSON
  raw_original_subtotal: JSON
  raw_original_tax_total: JSON
  raw_total: JSON
  raw_subtotal: JSON
  raw_tax_total: JSON
  raw_discount_total: JSON
  raw_discount_tax_total: JSON
  raw_gift_card_total: JSON
  raw_gift_card_tax_total: JSON
  raw_shipping_total: JSON
  raw_shipping_subtotal: JSON
  raw_shipping_tax_total: JSON
  raw_original_shipping_total: JSON
  raw_original_shipping_subtotal: JSON
  raw_original_shipping_tax_total: JSON
  payment_collections: [PaymentCollection]
  payment_status: PaymentStatus!
  fulfillments: [Fulfillment]
  fulfillment_status: FulfillmentStatus!
}

type OrderChange {
  id: ID!
  version: Int!
  change_type: String
  order_id: String!
  return_id: String
  exchange_id: String
  claim_id: String
  order: Order!
  return_order: Return
  exchange: OrderExchange
  claim: OrderClaim
  actions: [OrderChangeAction]!
  status: String!
  requested_by: String
  requested_at: DateTime
  confirmed_by: String
  confirmed_at: DateTime
  declined_by: String
  declined_reason: String
  metadata: JSON
  declined_at: DateTime
  canceled_by: String
  canceled_at: DateTime
  created_at: DateTime!
  updated_at: DateTime!
}

type OrderChangeAction {
  id: ID!
  order_change_id: String
  order_change: OrderChange
  order_id: String
  return_id: String
  claim_id: String
  exchange_id: String
  order: Order
  reference: String!
  reference_id: String!
  action: ChangeActionType!
  details: JSON
  internal_note: String
  created_at: DateTime!
  updated_at: DateTime!
}

type OrderTransaction {
  id: ID!
  order_id: String!
  order: Order!
  amount: Float!
  raw_amount: JSON
  currency_code: String!
  reference: String!
  reference_id: String!
  metadata: JSON
  created_at: DateTime!
  updated_at: DateTime!
}

`
