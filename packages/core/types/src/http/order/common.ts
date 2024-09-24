import { BaseFilterable, OperatorMap } from "../../dal"
import { ChangeActionType, OrderChangeStatus } from "../../order"
import { BigNumberValue } from "../../totals"
import { BaseClaim } from "../claim/common"
import { FindParams } from "../common"
import { BaseExchange } from "../exchange/common"
import { BasePaymentCollection } from "../payment/common"
import { BaseProduct, BaseProductVariant } from "../product/common"
import { BaseReturn } from "../return/common"

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
  detail?: BaseOrderShippingDetail
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
  variant?: BaseProductVariant | null
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
  delivered_quantity: number
  shipped_quantity: number
  return_requested_quantity: number
  return_received_quantity: number
  return_dismissed_quantity: number
  written_off_quantity: number
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

export interface BaseOrderShippingDetail {
  id: string
  shipping_method_id: string
  shipping_method: BaseOrderShippingMethod
  claim_id: string
  exchange_id: string
  return_id: string
  created_at: Date
  updated_at: Date
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
  packed_at: Date | null
  shipped_at: Date | null
  delivered_at: Date | null
  canceled_at: Date | null
  requires_shipping: boolean
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
  display_id?: number
  shipping_address?: BaseOrderAddress | null
  billing_address?: BaseOrderAddress | null
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

export interface BaseOrderFilters
  extends FindParams,
    BaseFilterable<BaseOrderFilters> {
  id?: string[] | string | OperatorMap<string | string[]>
  status?: string[] | string | OperatorMap<string | string[]>
}

export interface BaseOrderChangesFilters
  extends BaseFilterable<BaseOrderChangesFilters> {
  id?: string[] | string | OperatorMap<string | string[]>
  status?: string[] | string | OperatorMap<string | string[]>
  change_type?: string[] | string | OperatorMap<string | string[]>
}

export interface BaseOrderChange {
  /**
   * The ID of the order change
   */
  id: string

  /**
   * The version of the order change
   */
  version: number

  /**
   * The type of the order change
   */
  change_type?: "return" | "exchange" | "claim" | "edit" | "return_request"

  /**
   * The ID of the associated order
   */
  order_id: string

  /**
   * The ID of the associated return order
   */
  return_id: string

  /**
   * The ID of the associated exchange order
   */
  exchange_id: string

  /**
   * The ID of the associated claim order
   */
  claim_id: string

  /**
   * The associated order
   *
   * @expandable
   */
  order: BaseOrder

  /**
   * The associated return order
   *
   * @expandable
   */
  return_order: BaseReturn

  /**
   * The associated exchange order
   *
   * @expandable
   */
  exchange: BaseExchange

  /**
   * The associated claim order
   *
   * @expandable
   */
  claim: BaseClaim

  /**
   * The actions of the order change
   *
   * @expandable
   */
  actions: BaseOrderChangeAction[]

  /**
   * The status of the order change
   */
  status: OrderChangeStatus

  /**
   * The requested by of the order change
   */
  requested_by: string | null

  /**
   * When the order change was requested
   */
  requested_at: Date | null

  /**
   * The confirmed by of the order change
   */
  confirmed_by: string | null

  /**
   * When the order change was confirmed
   */
  confirmed_at: Date | null

  /**
   * The declined by of the order change
   */
  declined_by: string | null

  /**
   * The declined reason of the order change
   */
  declined_reason: string | null

  /**
   * The metadata of the order change
   */
  metadata: Record<string, unknown> | null

  /**
   * When the order change was declined
   */
  declined_at: Date | null

  /**
   * The canceled by of the order change
   */
  canceled_by: string | null

  /**
   * When the order change was canceled
   */
  canceled_at: Date | null

  /**
   * When the order change was created
   */
  created_at: Date | string

  /**
   * When the order change was updated
   */
  updated_at: Date | string
}

/**
 * The order change action details.
 */
export interface BaseOrderChangeAction {
  /**
   * The ID of the order change action
   */
  id: string

  /**
   * The ID of the associated order change
   */
  order_change_id: string | null

  /**
   * The associated order change
   *
   * @expandable
   */
  order_change: BaseOrderChange | null

  /**
   * The ID of the associated order
   */
  order_id: string | null

  /**
   * The ID of the associated return.
   */
  return_id: string | null

  /**
   * The ID of the associated claim.
   */
  claim_id: string | null

  /**
   * The ID of the associated exchange.
   */
  exchange_id: string | null

  /**
   * The associated order
   *
   * @expandable
   */
  order: BaseOrder | null

  /**
   * The reference of the order change action
   */
  reference: "claim" | "exchange" | "return" | "order_shipping_method"

  /**
   * The ID of the reference
   */
  reference_id: string

  /**
   * The action of the order change action
   */
  action: ChangeActionType

  /**
   * The details of the order change action
   */
  details: Record<string, unknown> | null

  /**
   * The internal note of the order change action
   */
  internal_note: string | null

  /**
   * When the order change action was created
   */
  created_at: Date | string

  /**
   * When the order change action was updated
   */
  updated_at: Date | string
}
