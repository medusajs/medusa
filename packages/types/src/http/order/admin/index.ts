import { BigNumberRawValue } from "../../../totals"
import { PaginatedResponse } from "../../common"

interface OrderSummary {
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
  future_total: number
  future_subtotal: number
  future_total_tax: number
  future_projected_total: number
  balance: number
  future_balance: number
}

interface OrderAdjustmentLine {
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

interface OrderShippingMethodAdjustment extends OrderAdjustmentLine {
  shipping_method: OrderShippingMethod
  shipping_method_id: string
}

interface OrderLineItemAdjustment extends OrderAdjustmentLine {
  item: OrderLineItem
  item_id: string
}

interface OrderTaxLine {
  id: string
  description?: string
  tax_rate_id?: string
  code: string
  rate: number
  provider_id?: string
  created_at: Date | string
  updated_at: Date | string
}

interface OrderShippingMethodTaxLine extends OrderTaxLine {
  shipping_method: OrderShippingMethod
  shipping_method_id: string
  total: number
  subtotal: number
  raw_total?: BigNumberRawValue
  raw_subtotal?: BigNumberRawValue
}

interface OrderLineItemTaxLine extends OrderTaxLine {
  item: OrderLineItem
  item_id: string
  total: number
  subtotal: number
  raw_total?: BigNumberRawValue
  raw_subtotal?: BigNumberRawValue
}

interface OrderAddress {
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

interface OrderShippingMethod {
  id: string
  order_id: string
  name: string
  description?: string
  amount: number
  raw_amount?: BigNumberRawValue
  is_tax_inclusive: boolean
  shipping_option_id: string | null
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  tax_lines?: OrderShippingMethodTaxLine[]
  adjustments?: OrderShippingMethodAdjustment[]
  created_at: Date | string
  updated_at: Date | string
}

interface OrderLineItem {
  id: string
  title: string
  subtitle: string | null
  thumbnail: string | null
  variant_id: string | null
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
  raw_compare_at_unit_price?: BigNumberRawValue
  unit_price: number
  raw_unit_price?: BigNumberRawValue
  quantity: number
  raw_quantity?: BigNumberRawValue
  tax_lines?: OrderLineItemTaxLine[]
  adjustments?: OrderLineItemAdjustment[]
  detail: OrderItemDetail
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
  raw_original_total?: BigNumberRawValue
  raw_original_subtotal?: BigNumberRawValue
  raw_original_tax_total?: BigNumberRawValue
  raw_item_total?: BigNumberRawValue
  raw_item_subtotal?: BigNumberRawValue
  raw_item_tax_total?: BigNumberRawValue
  raw_total?: BigNumberRawValue
  raw_subtotal?: BigNumberRawValue
  raw_tax_total?: BigNumberRawValue
  raw_discount_total?: BigNumberRawValue
  raw_discount_tax_total?: BigNumberRawValue
}

interface OrderItemDetail {
  id: string
  item_id: string
  item: OrderLineItem
  quantity: number
  fulfilled_quantity: number
  shipped_quantity: number
  return_requested_quantity: number
  return_received_quantity: number
  return_dismissed_quantity: number
  written_off_quantity: number
  raw_quantity?: BigNumberRawValue
  raw_fulfilled_quantity?: BigNumberRawValue
  raw_shipped_quantity?: BigNumberRawValue
  raw_return_requested_quantity?: BigNumberRawValue
  raw_return_received_quantity?: BigNumberRawValue
  raw_return_dismissed_quantity?: BigNumberRawValue
  raw_written_off_quantity?: BigNumberRawValue
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

interface OrderChange {
  id: string
  order_id: string
  actions: OrderChangeAction[]
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

interface OrderChangeAction {
  id: string
  order_change_id: string | null
  order_change: OrderChange | null
  order_id: string | null
  reference: string
  reference_id: string
  action: string
  details: Record<string, unknown> | null
  internal_note: string | null
  created_at: Date | string
  updated_at: Date | string
}

interface OrderTransaction {
  id: string
  order_id: string
  amount: number
  raw_amount?: BigNumberRawValue
  currency_code: string
  reference: string
  reference_id: string
  metadata: Record<string, unknown> | null
  created_at: Date | string
  updated_at: Date | string
}

/**
 * @experimental
 */
export interface OrderResponse {
  id: string
  version: number
  region_id: string | null
  customer_id: string | null
  sales_channel_id: string | null
  email: string | null
  currency_code: string
  shipping_address?: OrderAddress
  billing_address?: OrderAddress
  items: OrderLineItem[] | null
  shipping_methods: OrderShippingMethod[] | null
  transactions?: OrderTransaction[]
  summary: OrderSummary
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
  raw_original_item_total?: BigNumberRawValue
  raw_original_item_subtotal?: BigNumberRawValue
  raw_original_item_tax_total?: BigNumberRawValue
  raw_item_total?: BigNumberRawValue
  raw_item_subtotal?: BigNumberRawValue
  raw_item_tax_total?: BigNumberRawValue
  raw_original_total?: BigNumberRawValue
  raw_original_subtotal?: BigNumberRawValue
  raw_original_tax_total?: BigNumberRawValue
  raw_total?: BigNumberRawValue
  raw_subtotal?: BigNumberRawValue
  raw_tax_total?: BigNumberRawValue
  raw_discount_total?: BigNumberRawValue
  raw_discount_tax_total?: BigNumberRawValue
  raw_gift_card_total?: BigNumberRawValue
  raw_gift_card_tax_total?: BigNumberRawValue
  raw_shipping_total?: BigNumberRawValue
  raw_shipping_subtotal?: BigNumberRawValue
  raw_shipping_tax_total?: BigNumberRawValue
  raw_original_shipping_total?: BigNumberRawValue
  raw_original_shipping_subtotal?: BigNumberRawValue
  raw_original_shipping_tax_total?: BigNumberRawValue
}

/**
 * @experimental
 */
export interface AdminOrderListResponse extends PaginatedResponse {
  orders: OrderResponse[]
}

/**
 * @experimental
 */
export interface AdminOrderResponse {
  order: OrderResponse
}
