import { BaseFilterable, OperatorMap } from "../../dal"
import { ChangeActionType, OrderChangeStatus, OrderStatus } from "../../order"
import { BaseClaim } from "../claim/common"
import { FindParams } from "../common"
import { BaseExchange } from "../exchange/common"
import { BasePaymentCollection } from "../payment/common"
import { BaseProduct, BaseProductVariant } from "../product/common"
import { BaseReturn } from "../return/common"

export interface BaseOrderSummary {
  /**
   * The total of the order including taxes and promotions.
   */
  total: number
  /**
   * The total of the order excluding taxes, including promotions.
   */
  subtotal: number
  /**
   * The tax totals of the order including promotions.
   */
  total_tax: number
  /**
   * The total ordered amount.
   */
  ordered_total: number
  /**
   * The total fulfilled amount.
   */
  fulfilled_total: number
  /**
   * The total amount of returned items.
   */
  returned_total: number
  /**
   * The total amount of the items requested to be returned.
   */
  return_request_total: number
  /**
   * The total amount of the items removed from the order.
   */
  write_off_total: number
  /**
   * The total amount paid.
   */
  paid_total: number
  /**
   * The total amount refunded
   */
  refunded_total: number
}

export interface BaseOrderAdjustmentLine {
  /**
   * The adjustment line's ID.
   */
  id: string
  /**
   * The adjustment's promotion code.
   */
  code?: string
  /**
   * The adjustment's amount.
   */
  amount: number
  /**
   * The ID of the order this adjustment line belongs to.
   */
  order_id: string
  /**
   * The adjustment's description.
   */
  description?: string
  /**
   * The ID of the applied promotion.
   */
  promotion_id?: string
  /**
   * The ID of the associated provider.
   */
  provider_id?: string
  /**
   * The date the adjustment was created.
   */
  created_at: Date | string
  /**
   * The date the adjustment was updated.
   */
  updated_at: Date | string
}

export interface BaseOrderShippingMethodAdjustment
  extends BaseOrderAdjustmentLine {
  /**
   * The associated shipping method's details.
   */
  shipping_method: BaseOrderShippingMethod
  /**
   * The associated shipping method's ID.
   */
  shipping_method_id: string
}

export interface BaseOrderLineItemAdjustment extends BaseOrderAdjustmentLine {
  /**
   * The associated item's details.
   */
  item: BaseOrderLineItem
  /**
   * The associated item's ID.
   */
  item_id: string
}

export interface BaseOrderTaxLine {
  /**
   * The ID of thet ax line.
   */
  id: string
  /**
   * The tax rate's description.
   */
  description?: string
  /**
   * The ID of the associated tax rate.
   */
  tax_rate_id?: string
  /**
   * The associated tax rate's code.
   */
  code: string
  /**
   * The rate charged.
   */
  rate: number
  /**
   * The ID of the tax provider used.
   */
  provider_id?: string
  /**
   * The date the tax line was created.
   */
  created_at: Date | string
  /**
   * The date the tax line was updated.
   */
  updated_at: Date | string
}

export interface BaseOrderShippingMethodTaxLine extends BaseOrderTaxLine {
  /**
   * The shipping method's details.
   */
  shipping_method: BaseOrderShippingMethod
  /**
   * The shipping method's ID.
   */
  shipping_method_id: string
  /**
   * The shipping method's total including taxes and promotions.
   */
  total: number
  /**
   * The shipping method's total excluding taxes, including promotions.
   */
  subtotal: number
}

export interface BaseOrderLineItemTaxLine extends BaseOrderTaxLine {
  /**
   * The item's details.
   */
  item: BaseOrderLineItem
  /**
   * The item's ID.
   */
  item_id: string
  /**
   * The item's total including taxes and promotions.
   */
  total: number
  /**
   * The item's total excluding taxes, including promotions.
   */
  subtotal: number
}

export interface BaseOrderAddress {
  /**
   * The address's ID.
   */
  id: string
  /**
   * The ID of the customer this address belongs to.
   */
  customer_id?: string
  /**
   * The address's first name.
   */
  first_name?: string
  /**
   * The address's last name.
   */
  last_name?: string
  /**
   * The address's phone.
   */
  phone?: string
  /**
   * The address's company.
   */
  company?: string
  /**
   * The address's first line.
   */
  address_1?: string
  /**
   * The address's second line.
   */
  address_2?: string
  /**
   * The address's city.
   */
  city?: string
  /**
   * The address's country code.
   * 
   * @example us
   */
  country_code?: string
  /**
   * The address's province.
   */
  province?: string
  /**
   * The address's postal code.
   */
  postal_code?: string
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the address was created.
   */
  created_at: Date | string
  /**
   * The date the address was updated.
   */
  updated_at: Date | string
}

export interface BaseOrderShippingMethod {
  /**
   * The shipping method's ID.
   */
  id: string
  /**
   * The ID of the order this shipping method belongs to.
   */
  order_id: string
  /**
   * The shipping method's name.
   */
  name: string
  /**
   * The shipping method's description.
   */
  description?: string
  /**
   * The shipping method's amount.
   */
  amount: number
  /**
   * Whether the shipping method's amount includes taxes.
   */
  is_tax_inclusive: boolean
  /**
   * The ID of the shipping option this method was created from.
   */
  shipping_option_id: string | null
  /**
   * Data relevant for the fulfillment provider handling the shipping.
   * 
   * Learn more in [this guide](https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/shipping-option#data-property).
   */
  data: Record<string, unknown> | null
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The shipping method's tax lines.
   */
  tax_lines?: BaseOrderShippingMethodTaxLine[]
  /**
   * The shipping method's adjustments.
   */
  adjustments?: BaseOrderShippingMethodAdjustment[]
  /**
   * The total of the shipping method including taxes, excluding promotions.
   */
  original_total: number
  /**
   * The total of the shipping method excluding taxes, including promotions.
   */
  original_subtotal: number
  /**
   * The tax total of the shipping method excluding promotions.
   */
  original_tax_total: number
  /**
   * The total of the shipping method including taxes and promotions.
   */
  total: number
  /**
   * The shipping method's action details.
   */
  detail?: BaseOrderShippingDetail
  /**
   * The total of the shipping method excluding taxes, including promotions.
   */
  subtotal: number
  /**
   * The tax total of the shipping method including promotions.
   */
  tax_total: number
  /**
   * The total discounted amount.
   */
  discount_total: number
  /**
   * The tax total of the shipping method's discounted amount.
   */
  discount_tax_total: number
  /**
   * The date the shipping method was created.
   */
  created_at: Date | string
  /**
   * The date the shipping method was updated.
   */
  updated_at: Date | string
}

export interface BaseOrderLineItem {
  /**
   * The item's ID.
   */
  id: string
  /**
   * The item's title.
   */
  title: string
  /**
   * The item's subtitle.
   */
  subtitle: string | null
  /**
   * The URL of the item's thumbnail.
   */
  thumbnail: string | null
  /**
   * The item's associated variant.
   */
  variant?: BaseProductVariant | null
  /**
   * The ID of the associated variant.
   */
  variant_id: string | null
  /**
   * The item's associated product..
   */
  product?: BaseProduct
  /**
   * The ID of the associated product.
   */
  product_id: string | null
  /**
   * The associated product's title.
   */
  product_title: string | null
  /**
   * The associated product's description.
   */
  product_description: string | null
  /**
   * The associated product's subtitle.
   */
  product_subtitle: string | null
  /**
   * The ID of the associated product's type.
   */
  product_type: string | null
  /**
   * The ID of the associated product's collection.
   */
  product_collection: string | null
  /**
   * The associated product's handle.
   */
  product_handle: string | null
  /**
   * The associated variant's SKU.
   */
  variant_sku: string | null
  /**
   * The associated variant's barcode.
   */
  variant_barcode: string | null
  /**
   * The associated variant's title.
   */
  variant_title: string | null
  /**
   * The associated variant's values for the product's options.
   */
  variant_option_values: Record<string, unknown> | null
  /**
   * Whether the item requires shipping.
   */
  requires_shipping: boolean
  /**
   * Whether discounts can be applied on the item.
   */
  is_discountable: boolean
  /**
   * Whether the item's price includes taxes.
   */
  is_tax_inclusive: boolean
  /**
   * The original price of the item before a promotion or sale.
   */
  compare_at_unit_price?: number
  /**
   * The price of a single quantity of the item.
   */
  unit_price: number
  /**
   * The item's quantity.
   */
  quantity: number
  /**
   * The item's tax lines.
   */
  tax_lines?: BaseOrderLineItemTaxLine[]
  /**
   * The item's adjustments.
   */
  adjustments?: BaseOrderLineItemAdjustment[]
  /**
   * The item's action details.
   */
  detail: BaseOrderItemDetail
  /**
   * The date the item was created.
   */
  created_at: Date
  /**
   * The date the item was updated.
   */
  updated_at: Date
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The total of the item including taxes, excluding promotions.
   */
  original_total: number
  /**
   * The total of the item excluding taxes, including promotions.
   */
  original_subtotal: number
  /**
   * The total taxes applied on the item, excluding promotions.
   */
  original_tax_total: number
  /**
   * The total of a single quantity of the the item including taxes and promotions.
   */
  item_total: number
  /**
   * The total of a single quantity of the the item excluding taxes, including promotions.
   */
  item_subtotal: number
  /**
   * The total taxes applied on a single quantity of the item, including promotions.
   */
  item_tax_total: number
  /**
   * The total of the item including taxes and promotions.
   */
  total: number
  /**
   * The total of the item excluding taxes, including promotions.
   */
  subtotal: number
  /**
   * The total taxes of the item, including promotions.
   */
  tax_total: number
  /**
   * The total discount applied on the item.
   */
  discount_total: number
  /**
   * The total taxes applied on the discounted amount.
   */
  discount_tax_total: number
  /**
   * The total amount that can be refunded.
   */
  refundable_total: number
  /**
   * The total amount that can be refunded for a single quantity.
   */
  refundable_total_per_unit: number
}

export interface BaseOrderItemDetail {
  /**
   * The item detail's ID.
   */
  id: string
  /**
   * The ID of the associated item.
   */
  item_id: string
  /**
   * The associated item.
   */
  item: BaseOrderLineItem
  /**
   * The item's total quantity.
   */
  quantity: number
  /**
   * The item's fulfilled quantity.
   */
  fulfilled_quantity: number
  /**
   * The item's delivered quantity.
   */
  delivered_quantity: number
  /**
   * The item's shipped quantity.
   */
  shipped_quantity: number
  /**
   * The item's quantity that's requested to be returned.
   */
  return_requested_quantity: number
  /**
   * The item's quantity that's received by a return.
   */
  return_received_quantity: number
  /**
   * The item's quantity that's returned but dismissed due to damages or other reasons.
   */
  return_dismissed_quantity: number
  /**
   * The item's quantity removed from the order.
   */
  written_off_quantity: number
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the detail was created.
   */
  created_at: Date
  /**
   * The date the detail was deleted.
   */
  updated_at: Date
}

export interface BaseOrderShippingDetail {
  /**
   * The shipping details' ID.
   */
  id: string
  /**
   * The ID of the shipping method it belongs to.
   */
  shipping_method_id: string
  /**
   * The shipping method it belongs to.
   */
  shipping_method: BaseOrderShippingMethod
  /**
   * The ID of the associated claim.
   */
  claim_id?: string
  /**
   * The ID of the associated exchange.
   */
  exchange_id?: string
  /**
   * The ID of the associated return.
   */
  return_id?: string
  /**
   * The date the detail was created.
   */
  created_at: Date
  /**
   * The date the detail was updated.
   */
  updated_at: Date
}

export interface BaseOrderTransaction {
  /**
   * The transaction's ID.
   */
  id: string
  /**
   * The ID of the order this transaction belongs to.
   */
  order_id: string
  /**
   * The transaction's amount.
   */
  amount: number
  /**
   * The transaction's currency code.
   * 
   * @example
   * usd
   */
  currency_code: string
  /**
   * Whether the transaction references a capture or refund.
   */
  reference: "capture" | "refund"
  /**
   * The ID of the capture or refund, depending on the value of {@link reference}.
   */
  reference_id: string
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the transaction was created.
   */
  created_at: Date | string
  /**
   * The date the transaction was updated.
   */
  updated_at: Date | string
}

export interface BaseOrderFulfillment {
  /**
   * The fulfillment's ID.
   */
  id: string
  /**
   * The ID of the location the items are fulfilled from.
   */
  location_id: string
  /**
   * The date the fulfillment was packed.
   */
  packed_at: Date | null
  /**
   * The date the fulfillment was shipped.
   */
  shipped_at: Date | null
  /**
   * The date the fulfillment was delivered.
   */
  delivered_at: Date | null
  /**
   * The date the fulfillment was canceled.
   */
  canceled_at: Date | null
  /**
   * Whether the fulfillment requires shipping.
   */
  requires_shipping: boolean
  /**
   * Data necessary for the provider handling the fulfillment.
   * 
   * Learn more in [this guide](https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/shipping-option#data-property).
   */
  data: Record<string, unknown> | null
  /**
   * The ID of the fulfillment provider handling this fulfillment.
   */
  provider_id: string
  /**
   * The ID of the associated shipping option.
   */
  shipping_option_id: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the fulfillment was created.
   */
  created_at: Date
  /**
   * The date the fulfillment was updated.
   */
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
  /**
   * The order's ID.
   */
  id: string
  /**
   * The order's version.
   */
  version: number
  /**
   * The ID of the associated region.
   */
  region_id: string | null
  /**
   * The ID of the customer that placed the order.
   */
  customer_id: string | null
  /**
   * The ID of the sales channel the order was placed in.
   */
  sales_channel_id: string | null
  /**
   * The email of the customer that placed the order.
   */
  email: string | null
  /**
   * The order's currency code.
   * 
   * @example
   * usd
   */
  currency_code: string
  /**
   * The order's display ID.
   */
  display_id?: number
  /**
   * The order's shipping address.
   */
  shipping_address?: BaseOrderAddress | null
  /**
   * The order's billing address.
   */
  billing_address?: BaseOrderAddress | null
  /**
   * The order's items.
   */
  items: BaseOrderLineItem[] | null
  /**
   * The order's shipping methods.
   */
  shipping_methods: BaseOrderShippingMethod[] | null
  /**
   * The order's payment collections.
   */
  payment_collections?: BasePaymentCollection[]
  /**
   * The order's payment status.
   */
  payment_status: PaymentStatus
  /**
   * The order's fulfillments.
   */
  fulfillments?: BaseOrderFulfillment[]
  /**
   * The order's fulfillment status.
   */
  fulfillment_status: FulfillmentStatus
  /**
   * The order's transactions.
   */
  transactions?: BaseOrderTransaction[]
  /**
   * The order's summary.
   */
  summary: BaseOrderSummary
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The date the order was created.
   */
  created_at: string | Date
  /**
   * The date the order was updated.
   */
  updated_at: string | Date
  /**
   * The total of the order's items including taxes, excluding promotions.
   */
  original_item_total: number
  /**
   * The total of the order's items excluding taxes, including promotions.
   */
  original_item_subtotal: number
  /**
   * The tax total applied on the order's items, excluding promotions.
   */
  original_item_tax_total: number
  /**
   * The total of the order's items including taxes and promotions.
   */
  item_total: number
  /**
   * The total of the order's items excluding taxes, including promotions.
   */
  item_subtotal: number
  /**
   * The tax total applied on the order's items, including promotions.
   */
  item_tax_total: number
  /**
   * The total of the order including taxes, excluding promotions.
   */
  original_total: number
  /**
   * The total of the order excluding taxes, including promotions.
   */
  original_subtotal: number
  /**
   * The tax total applied on the order's items, excluding promotions.
   */
  original_tax_total: number
  /**
   * The total of the order including taxes and promotions.
   */
  total: number
  /**
   * The total of the order excluding taxes, including promotions.
   */
  subtotal: number
  /**
   * The tax total applied on the order's items, including promotions.
   */
  tax_total: number
  /**
   * The total amount discounted.
   */
  discount_total: number
  /**
   * The tax total applied on the order's discounted amount.
   */
  discount_tax_total: number
  /**
   * The total gift card amount.
   */
  gift_card_total: number
  /**
   * The tax total applied on the order's gift card amount.
   */
  gift_card_tax_total: number
  /**
   * The total of the order's shipping methods including taxes and promotions.
   */
  shipping_total: number
  /**
   * The total of the order's shipping methods excluding taxes, including promotions.
   */
  shipping_subtotal: number
  /**
   * The tax total applied on the order's shipping methods, including promotions.
   */
  shipping_tax_total: number
  /**
   * The total of the order's shipping methods including taxes, excluding promotions.
   */
  original_shipping_total: number
  /**
   * The total of the order's shipping methods excluding taxes, including promotions.
   */
  original_shipping_subtotal: number
  /**
   * The tax total applied on the order's shipping methods, excluding promotions.
   */
  original_shipping_tax_total: number
}

export interface BaseOrderFilters
  extends FindParams,
    BaseFilterable<BaseOrderFilters> {
  /**
   * Filter by order ID(s).
   */
  id?: string[] | string | OperatorMap<string | string[]>
  /**
   * Filter by status(es).
   */
  status?: OrderStatus[] | OrderStatus | OperatorMap<OrderStatus | OrderStatus[]>
}

export interface BaseOrderChangesFilters
  extends BaseFilterable<BaseOrderChangesFilters> {
  /**
   * Filter by order change ID(s).
   */
  id?: string[] | string | OperatorMap<string | string[]>
  /**
   * Filter by status(es).
   */
  status?: string[] | string | OperatorMap<string | string[]>
  /**
   * Filter by order change type, such as `return`, `exchange`, `edit`, or `claim`.
   */
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
