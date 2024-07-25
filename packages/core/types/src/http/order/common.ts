import { BaseFilterable, OperatorMap } from "../../dal"
import { BigNumberValue } from "../../totals"
import { BasePaymentCollection } from "../payment/common"
import { BaseProduct, BaseProductVariant } from "../product/common"

export interface BaseOrderSummary {
  total: number
  subtotal: number
  total_tax: number
  ordered_total: number
  fulfilled_total: number
  returned_total: number
  return_request_total: number
  write_off_total: number
  projected_total: number
  net_total: number
  net_subtotal: number
  net_total_tax: number
  balance: number
  paid_total: number
  refunded_total: number
}

export interface BaseOrderAdjustmentLine {
  id: string
  code?: string
  amount: number
  order_id: string
  description?: string
  promotion_id?: string
  provider_id?: string
  created_at: Date | string
  updated_at: Date | string
}

export interface BaseOrderShippingMethodAdjustment
  extends BaseOrderAdjustmentLine {
  shipping_method: BaseOrderShippingMethod
  shipping_method_id: string
}

export interface BaseOrderLineItemAdjustment extends BaseOrderAdjustmentLine {
  item: BaseOrderLineItem
  item_id: string
}

export interface BaseOrderTaxLine {
  id: string
  description?: string
  tax_rate_id?: string
  code: string
  rate: number
  provider_id?: string
  created_at: Date | string
  updated_at: Date | string
}

export interface BaseOrderShippingMethodTaxLine extends BaseOrderTaxLine {
  shipping_method: BaseOrderShippingMethod
  shipping_method_id: string
  total: number
  subtotal: number
}

export interface BaseOrderLineItemTaxLine extends BaseOrderTaxLine {
  item: BaseOrderLineItem
  item_id: string
  total: number
  subtotal: number
}

export interface BaseOrderAddress {
  id: string
  customer_id?: string
  first_name?: string
  last_name?: string
  phone?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  metadata: Record<string, unknown> | null
  created_at: Date | string
  updated_at: Date | string
}

export interface BaseOrderShippingMethod {
  id: string
  order_id: string
  name: string
  description?: string
  amount: number
  is_tax_inclusive: boolean
  shipping_option_id: string | null
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  tax_lines?: BaseOrderShippingMethodTaxLine[]
  adjustments?: BaseOrderShippingMethodAdjustment[]
  original_total: BigNumberValue
  original_subtotal: BigNumberValue
  original_tax_total: BigNumberValue
  total: BigNumberValue
  subtotal: BigNumberValue
  tax_total: BigNumberValue
  discount_total: BigNumberValue
  discount_tax_total: BigNumberValue
  created_at: Date | string
  updated_at: Date | string
}

export interface BaseOrderLineItem {
  id: string
  title: string
  subtitle: string | null
  thumbnail: string | null
  variant?: BaseProductVariant
  variant_id: string | null
  product?: BaseProduct
  product_id: string | null
  product_title: string | null
  product_description: string | null
  product_subtitle: string | null
  product_type: string | null
  product_collection: string | null
  product_handle: string | null
  variant_sku: string | null
  variant_barcode: string | null
  variant_title: string | null
  variant_option_values: Record<string, unknown> | null
  requires_shipping: boolean
  is_discountable: boolean
  is_tax_inclusive: boolean
  compare_at_unit_price?: number
  unit_price: number
  quantity: number
  tax_lines?: BaseOrderLineItemTaxLine[]
  adjustments?: BaseOrderLineItemAdjustment[]
  detail: BaseOrderItemDetail
  created_at: Date
  updated_at: Date
  metadata: Record<string, unknown> | null
  original_total: number
  original_subtotal: number
  original_tax_total: number
  item_total: number
  item_subtotal: number
  item_tax_total: number
  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number
  refundable_total: number
  refundable_total_per_unit: number
}

export interface BaseOrderItemDetail {
  id: string
  item_id: string
  item: BaseOrderLineItem
  quantity: number
  fulfilled_quantity: number
  shipped_quantity: number
  return_requested_quantity: number
  return_received_quantity: number
  return_dismissed_quantity: number
  written_off_quantity: number
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

export interface BaseOrderChange {
  id: string
  order_id: string
  actions: BaseOrderChangeAction[]
  status: string
  requested_by: string | null
  requested_at: Date | string | null
  confirmed_by: string | null
  confirmed_at: Date | string | null
  declined_by: string | null
  declined_reason: string | null
  metadata: Record<string, unknown> | null
  declined_at: Date | string | null
  canceled_by: string | null
  canceled_at: Date | string | null
  created_at: Date | string
  updated_at: Date | string
}

export interface BaseOrderChangeAction {
  id: string
  order_change_id: string | null
  order_change: BaseOrderChange | null
  order_id: string | null
  reference: string
  reference_id: string
  action: string
  details: Record<string, unknown> | null
  internal_note: string | null
  created_at: Date | string
  updated_at: Date | string
}

export interface BaseOrderTransaction {
  id: string
  order_id: string
  amount: number
  currency_code: string
  reference: string
  reference_id: string
  metadata: Record<string, unknown> | null
  created_at: Date | string
  updated_at: Date | string
}

export interface BaseOrderFulfillment {
  id: string
  location_id: string
  is_return: boolean
  packed_at: Date | null
  shipped_at: Date | null
  delivered_at: Date | null
  canceled_at: Date | null
  data: Record<string, unknown> | null
  provider_id: string
  shipping_option_id: string | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

type PaymentStatus =
  | "not_paid"
  | "awaiting"
  | "authorized"
  | "partially_authorized"
  | "captured"
  | "partially_captured"
  | "partially_refunded"
  | "refunded"
  | "canceled"
  | "requires_action"

type FulfillmentStatus =
  | "not_fulfilled"
  | "partially_fulfilled"
  | "fulfilled"
  | "partially_shipped"
  | "shipped"
  | "partially_delivered"
  | "delivered"
  | "canceled"

export interface BaseOrder {
  id: string
  version: number
  region_id: string | null
  customer_id: string | null
  sales_channel_id: string | null
  email: string | null
  currency_code: string
  display_id?: string
  shipping_address?: BaseOrderAddress
  billing_address?: BaseOrderAddress
  items: BaseOrderLineItem[] | null
  shipping_methods: BaseOrderShippingMethod[] | null
  payment_collections?: BasePaymentCollection[]
  payment_status: PaymentStatus
  fulfillments?: BaseOrderFulfillment[]
  fulfillment_status: FulfillmentStatus
  transactions?: BaseOrderTransaction[]
  summary: BaseOrderSummary
  metadata: Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
  original_item_total: number
  original_item_subtotal: number
  original_item_tax_total: number
  item_total: number
  item_subtotal: number
  item_tax_total: number
  original_total: number
  original_subtotal: number
  original_tax_total: number
  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number
  gift_card_total: number
  gift_card_tax_total: number
  shipping_total: number
  shipping_subtotal: number
  shipping_tax_total: number
  original_shipping_total: number
  original_shipping_subtotal: number
  original_shipping_tax_total: number
}

export interface BaseOrderFilters extends BaseFilterable<BaseOrderFilters> {
  id?: string[] | string | OperatorMap<string | string[]>
  status?: string[] | string | OperatorMap<string | string[]>
}
