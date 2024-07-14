import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"
import { FulfillmentDTO } from "../fulfillment"
import { PaymentCollectionDTO } from "../payment"
import { BigNumberInput, BigNumberRawValue, BigNumberValue } from "../totals"

export type ChangeActionType =
  | "CANCEL"
  | "CANCEL_RETURN_ITEM"
  | "FULFILL_ITEM"
  | "CANCEL_ITEM_FULFILLMENT"
  | "ITEM_ADD"
  | "ITEM_REMOVE"
  | "RECEIVE_DAMAGED_RETURN_ITEM"
  | "RECEIVE_RETURN_ITEM"
  | "RETURN_ITEM"
  | "SHIPPING_ADD"
  | "SHIPPING_REMOVE"
  | "SHIP_ITEM"
  | "WRITE_OFF_ITEM"
  | "REINSTATE_ITEM"

export type OrderSummaryDTO = {
  total: BigNumberValue
  subtotal: BigNumberValue
  total_tax: BigNumberValue

  ordered_total: BigNumberValue
  fulfilled_total: BigNumberValue
  returned_total: BigNumberValue
  return_request_total: BigNumberValue
  write_off_total: BigNumberValue
  projected_total: BigNumberValue

  net_total: BigNumberValue
  net_subtotal: BigNumberValue
  net_total_tax: BigNumberValue

  future_total: BigNumberValue
  future_subtotal: BigNumberValue
  future_total_tax: BigNumberValue
  future_projected_total: BigNumberValue

  balance: BigNumberValue
  future_balance: BigNumberValue

  paid_total: BigNumberValue
  refunded_total: BigNumberValue
}

export interface OrderAdjustmentLineDTO {
  /**
   * The ID of the adjustment line
   */
  id: string
  /**
   * The code of the adjustment line
   */
  code?: string
  /**
   * The amount of the adjustment line
   */
  amount: BigNumberValue
  /**
   * The ID of the associated order
   */
  order_id: string
  /**
   * The description of the adjustment line
   */
  description?: string
  /**
   * The ID of the associated promotion
   */
  promotion_id?: string
  /**
   * The ID of the associated provider
   */
  provider_id?: string
  /**
   * When the adjustment line was created
   */
  created_at: Date | string
  /**
   * When the adjustment line was updated
   */
  updated_at: Date | string
}

export interface OrderShippingMethodAdjustmentDTO
  extends OrderAdjustmentLineDTO {
  /**
   * The associated shipping method
   */
  shipping_method: OrderShippingMethodDTO
  /**
   * The ID of the associated shipping method
   */
  shipping_method_id: string
}

export interface OrderLineItemAdjustmentDTO extends OrderAdjustmentLineDTO {
  /**
   * The associated line item
   * @expandable
   */
  item: OrderLineItemDTO
  /**
   * The associated line item
   */
  item_id: string
}

export interface OrderTaxLineDTO {
  /**
   * The ID of the tax line
   */
  id: string
  /**
   * The description of the tax line
   */
  description?: string
  /**
   * The ID of the associated tax rate
   */
  tax_rate_id?: string
  /**
   * The code of the tax line
   */
  code: string
  /**
   * The rate of the tax line
   */
  rate: number
  /**
   * The ID of the associated provider
   */
  provider_id?: string
  /**
   * When the tax line was created
   */
  created_at: Date | string
  /**
   * When the tax line was updated
   */
  updated_at: Date | string
}

export interface OrderShippingMethodTaxLineDTO extends OrderTaxLineDTO {
  /**
   * The associated shipping method
   */
  shipping_method: OrderShippingMethodDTO
  /**
   * The ID of the associated shipping method
   */
  shipping_method_id: string

  /**
   * The total tax relative to the shipping method.
   */
  total: BigNumberValue

  /**
   * The subtotal tax relative to the shipping method.
   */
  subtotal: BigNumberValue

  /**
   * The raw total tax relative to the shipping method.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal tax relative to the shipping method.
   */
  raw_subtotal: BigNumberRawValue
}

export interface OrderLineItemTaxLineDTO extends OrderTaxLineDTO {
  /**
   * The associated line item
   */
  item: OrderLineItemDTO
  /**
   * The ID of the associated line item
   */
  item_id: string

  /**
   * The total tax relative to the item.
   */
  total: BigNumberValue

  /**
   * The subtotal tax relative to the item.
   */
  subtotal: BigNumberValue

  /**
   * The raw total tax relative to the item.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal tax relative to the item.
   */
  raw_subtotal: BigNumberRawValue
}

export interface OrderAddressDTO {
  /**
   * The ID of the address
   */
  id: string
  /**
   * The customer ID of the address
   */
  customer_id?: string
  /**
   * The first name of the address
   */
  first_name?: string
  /**
   * The last name of the address
   */
  last_name?: string
  /**
   * The phone number of the address
   */
  phone?: string
  /**
   * The company of the address
   */
  company?: string
  /**
   * The first address line of the address
   */
  address_1?: string
  /**
   * The second address line of the address
   */
  address_2?: string
  /**
   * The city of the address
   */
  city?: string
  /**
   * The country code of the address
   */
  country_code?: string
  /**
   * The province/state of the address
   */
  province?: string
  /**
   * The postal code of the address
   */
  postal_code?: string
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the address was created.
   */
  created_at: Date | string
  /**
   * When the address was updated.
   */
  updated_at: Date | string
}

export interface OrderShippingMethodDTO {
  /**
   * The ID of the shipping method
   */
  id: string

  /**
   * The ID of the associated order
   */
  order_id: string

  /**
   * The name of the shipping method
   */
  name: string
  /**
   * The description of the shipping method
   */
  description?: string

  /**
   * The price of the shipping method
   */
  amount: BigNumberValue

  /**
   * The raw price of the shipping method
   */
  raw_amount: BigNumberRawValue
  /**
   * Whether the shipping method price is tax inclusive or not
   */
  is_tax_inclusive: boolean

  /**
   * The ID of the shipping option the method was created from
   */
  shipping_option_id?: string

  /**
   * Additional data needed for fulfillment.
   */
  data?: Record<string, unknown>

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The associated tax lines.
   *
   * @expandable
   */
  tax_lines?: OrderShippingMethodTaxLineDTO[]
  /**
   * The associated adjustments.
   *
   * @expandable
   */
  adjustments?: OrderShippingMethodAdjustmentDTO[]

  /**
   * When the shipping method was created.
   */
  created_at: Date | string
  /**
   * When the shipping method was updated.
   */
  updated_at: Date | string

  /**
   * The original total of the order shipping method.
   */
  original_total: BigNumberValue

  /**
   * The original subtotal of the order shipping method.
   */
  original_subtotal: BigNumberValue

  /**
   * The original tax total of the order shipping method.
   */
  original_tax_total: BigNumberValue

  /**
   * The total of the order shipping method.
   */
  total: BigNumberValue

  /**
   * The subtotal of the order shipping method.
   */
  subtotal: BigNumberValue

  /**
   * The tax total of the order shipping method.
   */
  tax_total: BigNumberValue

  /**
   * The discount total of the order shipping method.
   */
  discount_total: BigNumberValue

  /**
   * The discount tax total of the order shipping method.
   */
  discount_tax_total: BigNumberValue

  /**
   * The raw original total of the order shipping method.
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the order shipping method.
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the order shipping method.
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw total of the order shipping method.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the order shipping method.
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the order shipping method.
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the order shipping method.
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the order shipping method.
   */
  raw_discount_tax_total: BigNumberRawValue
}

export interface OrderLineItemTotalsDTO {
  /**
   * The original total of the order line item.
   */
  original_total: BigNumberValue

  /**
   * The original subtotal of the order line item.
   */
  original_subtotal: BigNumberValue

  /**
   * The original tax total of the order line item.
   */
  original_tax_total: BigNumberValue

  /**
   * The item total of the order line item.
   */
  item_total: BigNumberValue

  /**
   * The item subtotal of the order line item.
   */
  item_subtotal: BigNumberValue

  /**
   * The item tax total of the order line item.
   */
  item_tax_total: BigNumberValue

  /**
   * The total of the order line item.
   */
  total: BigNumberValue

  /**
   * The subtotal of the order line item.
   */
  subtotal: BigNumberValue

  /**
   * The tax total of the order line item.
   */
  tax_total: BigNumberValue

  /**
   * The discount total of the order line item.
   */
  discount_total: BigNumberValue

  /**
   * The discount tax total of the order line item.
   */
  discount_tax_total: BigNumberValue

  /**
   * The refundable total of the order line item.
   */
  refundable_total: BigNumberValue

  /**
   * The refundable total per unit of the order line item.
   */

  refundable_total_per_unit: BigNumberValue

  /**
   * The raw original total of the order line item.
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the order line item.
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the order line item.
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw item total of the order line item.
   */
  raw_item_total: BigNumberRawValue

  /**
   * The raw item subtotal of the order line item.
   */
  raw_item_subtotal: BigNumberRawValue

  /**
   * The raw item tax total of the order line item.
   */
  raw_item_tax_total: BigNumberRawValue

  /**
   * The raw total of the order line item.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the order line item.
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the order line item.
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the order line item.
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the order line item.
   */
  raw_discount_tax_total: BigNumberRawValue

  /**
   * The raw refundable total of the order line item..
   */
  raw_refundable_total: BigNumberRawValue

  /**
   * The raw  refundable total per unit of the order line item.
   */
  raw_refundable_total_per_unit: BigNumberRawValue
}

export interface OrderLineItemDTO extends OrderLineItemTotalsDTO {
  /**
   * The ID of the order line item.
   */
  id: string

  /**
   * The title of the order line item.
   */
  title: string

  /**
   * The subtitle of the order line item.
   */
  subtitle?: string | null

  /**
   * The thumbnail of the order line item.
   */
  thumbnail?: string | null

  /**
   * The ID of the variant associated with the order line item.
   */
  variant_id?: string | null

  /**
   * The ID of the product associated with the order line item.
   */
  product_id?: string | null

  /**
   * The title of the product associated with the order line item.
   */
  product_title?: string | null

  /**
   * The description of the product associated with the order line item.
   */
  product_description?: string | null

  /**
   * The subtitle of the product associated with the order line item.
   */
  product_subtitle?: string | null

  /**
   * The type of the product associated with the order line item.
   */
  product_type?: string | null

  /**
   * The collection of the product associated with the order line item.
   */
  product_collection?: string | null

  /**
   * The handle of the product associated with the order line item.
   */
  product_handle?: string | null

  /**
   * The SKU (stock keeping unit) of the variant associated with the order line item.
   */
  variant_sku?: string | null

  /**
   * The barcode of the variant associated with the order line item.
   */
  variant_barcode?: string | null

  /**
   * The title of the variant associated with the order line item.
   */
  variant_title?: string | null

  /**
   * The option values of the variant associated with the order line item.
   */
  variant_option_values?: Record<string, unknown> | null

  /**
   * Indicates whether the order line item requires shipping.
   */
  requires_shipping: boolean

  /**
   * Indicates whether the order line item is discountable.
   */
  is_discountable: boolean

  /**
   * Indicates whether the order line item price is tax inclusive.
   */
  is_tax_inclusive: boolean

  /**
   * The compare at unit price of the order line item.
   */
  compare_at_unit_price?: number

  /**
   * The raw compare at unit price of the order line item.
   */
  raw_compare_at_unit_price?: BigNumberRawValue

  /**
   * The unit price of the order line item.
   */
  unit_price: number

  /**
   * The raw unit price of the order line item.
   */
  raw_unit_price: BigNumberRawValue

  /**
   * The quantity of the order line item.
   */
  quantity: number

  /**
   * The raw quantity of the order line item.
   */
  raw_quantity: BigNumberRawValue

  /**
   * The associated tax lines.
   *
   * @expandable
   */
  tax_lines?: OrderLineItemTaxLineDTO[]
  /**
   * The associated adjustments.
   *
   * @expandable
   */
  adjustments?: OrderLineItemAdjustmentDTO[]

  /**
   * The details of the item
   */
  detail: OrderItemDTO

  /**
   * The date when the order line item was created.
   */
  created_at: Date

  /**
   * The date when the order line item was last updated.
   */
  updated_at: Date

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

export interface OrderItemDTO {
  /**
   * The ID of the order detail.
   */
  id: string

  /**
   * The ID of the associated item.
   */
  item_id: string

  /**
   * The Line Item of the order detail.
   */
  item: OrderLineItemDTO

  /**
   * The quantity of the order line item.
   */
  quantity: number

  /**
   * The raw quantity of the order line item.
   */
  raw_quantity: BigNumberRawValue

  /**
   * The fulfilled quantity of the order line item.
   */
  fulfilled_quantity: number

  /**
   * The raw fulfilled quantity of the order line item.
   */
  raw_fulfilled_quantity: BigNumberRawValue

  /**
   * The shipped quantity of the order line item.
   */
  shipped_quantity: number

  /**
   * The raw shipped quantity of the order line item.
   */
  raw_shipped_quantity: BigNumberRawValue

  /**
   * The quantity of return requested for the order line item.
   */
  return_requested_quantity: number

  /**
   * The raw quantity of return requested for the order line item.
   */
  raw_return_requested_quantity: BigNumberRawValue

  /**
   * The quantity of return received for the order line item.
   */
  return_received_quantity: number

  /**
   * The raw quantity of return received for the order line item.
   */
  raw_return_received_quantity: BigNumberRawValue

  /**
   * The quantity of return dismissed for the order line item.
   */
  return_dismissed_quantity: number

  /**
   * The raw quantity of return dismissed for the order line item.
   */
  raw_return_dismissed_quantity: BigNumberRawValue

  /**
   * The quantity of written off for the order line item.
   */
  written_off_quantity: number

  /**
   * The raw quantity of written off for the order line item.
   */
  raw_written_off_quantity: BigNumberRawValue

  /**
   * The metadata of the order detail
   */
  metadata: Record<string, unknown> | null

  /**
   * The date when the order line item was created.
   */
  created_at: Date

  /**
   * The date when the order line item was last updated.
   */
  updated_at: Date
}

type OrderStatus =
  | "pending"
  | "completed"
  | "draft"
  | "archived"
  | "canceled"
  | "requires_action"

export interface OrderDTO {
  /**
   * The ID of the order.
   */
  id: string
  /**
   * The version of the order.
   */
  version: number
  /**
   * The active order change, if any.
   */
  order_change?: OrderChangeDTO
  /**
   * The status of the order.
   */
  status: OrderStatus
  /**
   * The ID of the region the order belongs to.
   */
  region_id?: string
  /**
   * The ID of the customer on the order.
   */
  customer_id?: string
  /**
   * The ID of the sales channel the order belongs to.
   */
  sales_channel_id?: string
  /**
   * The email of the order.
   */
  email?: string
  /**
   * The currency of the order
   */
  currency_code: string
  /**
   * The associated shipping address.
   *
   * @expandable
   */
  shipping_address?: OrderAddressDTO
  /**
   * The associated billing address.
   *
   * @expandable
   */
  billing_address?: OrderAddressDTO
  /**
   * The associated order details / line items.
   *
   * @expandable
   */
  items?: OrderLineItemDTO[]
  /**
   * The associated shipping methods
   *
   * @expandable
   */
  shipping_methods?: OrderShippingMethodDTO[]

  /**
   * The tramsactions associated with the order
   *
   * @expandable
   */
  transactions?: OrderTransactionDTO[]
  /**
   * The summary of the order totals.
   */
  summary?: OrderSummaryDTO
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the order was canceled.
   */
  canceled_at?: string | Date
  /**
   * When the order was created.
   */
  created_at?: string | Date
  /**
   * When the order was updated.
   */
  updated_at?: string | Date

  /**
   * The original item total of the order.
   */
  original_item_total: BigNumberValue

  /**
   * The original item subtotal of the order.
   */
  original_item_subtotal: BigNumberValue

  /**
   * The original item tax total of the order.
   */
  original_item_tax_total: BigNumberValue

  /**
   * The item total of the order.
   */
  item_total: BigNumberValue

  /**
   * The item subtotal of the order.
   */
  item_subtotal: BigNumberValue

  /**
   * The item tax total of the order.
   */
  item_tax_total: BigNumberValue

  /**
   * The original total of the order.
   */
  original_total: BigNumberValue

  /**
   * The original subtotal of the order.
   */
  original_subtotal: BigNumberValue

  /**
   * The original tax total of the order.
   */
  original_tax_total: BigNumberValue

  /**
   * The total of the order.
   */
  total: BigNumberValue

  /**
   * The subtotal of the order. (Excluding taxes)
   */
  subtotal: BigNumberValue

  /**
   * The tax total of the order.
   */
  tax_total: BigNumberValue

  /**
   * The discount total of the order.
   */
  discount_total: BigNumberValue

  /**
   * The discount tax total of the order.
   */
  discount_tax_total: BigNumberValue

  /**
   * The gift card total of the order.
   */
  gift_card_total: BigNumberValue

  /**
   * The gift card tax total of the order.
   */
  gift_card_tax_total: BigNumberValue

  /**
   * The shipping total of the order.
   */
  shipping_total: BigNumberValue

  /**
   * The shipping subtotal of the order.
   */
  shipping_subtotal: BigNumberValue

  /**
   * The shipping tax total of the order.
   */
  shipping_tax_total: BigNumberValue

  /**
   * The original shipping total of the order.
   */
  original_shipping_total: BigNumberValue

  /**
   * The original shipping subtotal of the order.
   */
  original_shipping_subtotal: BigNumberValue

  /**
   * The original shipping tax total of the order.
   */
  original_shipping_tax_total: BigNumberValue

  /**
   * The raw original item total of the order.
   */
  raw_original_item_total: BigNumberRawValue

  /**
   * The raw original item subtotal of the order.
   */
  raw_original_item_subtotal: BigNumberRawValue

  /**
   * The raw original item tax total of the order.
   */
  raw_original_item_tax_total: BigNumberRawValue

  /**
   * The raw item total of the order.
   */
  raw_item_total: BigNumberRawValue

  /**
   * The raw item subtotal of the order.
   */
  raw_item_subtotal: BigNumberRawValue

  /**
   * The raw item tax total of the order.
   */
  raw_item_tax_total: BigNumberRawValue

  /**
   * The raw original total of the order.
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the order.
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the order.
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw total of the order.
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the order. (Excluding taxes)
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the order.
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the order.
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the order.
   */
  raw_discount_tax_total: BigNumberRawValue

  /**
   * The raw gift card total of the order.
   */
  raw_gift_card_total: BigNumberRawValue

  /**
   * The raw gift card tax total of the order.
   */
  raw_gift_card_tax_total: BigNumberRawValue

  /**
   * The raw shipping total of the order.
   */
  raw_shipping_total: BigNumberRawValue

  /**
   * The raw shipping subtotal of the order.
   */
  raw_shipping_subtotal: BigNumberRawValue

  /**
   * The raw shipping tax total of the order.
   */
  raw_shipping_tax_total: BigNumberRawValue

  /**
   * The raw original shipping total of the order.
   */
  raw_original_shipping_total: BigNumberRawValue

  /**
   * The raw original shipping subtotal of the order.
   */
  raw_original_shipping_subtotal: BigNumberRawValue

  /**
   * The raw original shipping tax total of the order.
   */
  raw_original_shipping_tax_total: BigNumberRawValue
}

type ReturnStatus = "requested" | "received" | "partially_received" | "canceled"

export interface ReturnDTO extends Omit<OrderDTO, "status" | "version"> {
  status: ReturnStatus
  refund_amount?: BigNumberValue
  order_id: string
}

export interface OrderClaimDTO
  extends Omit<OrderDTO, "status" | "version" | "items"> {
  claim_items: any[]
  additional_items: any[]
  return?: ReturnDTO
  no_notification?: boolean
  refund_amount?: BigNumberValue
}

export interface OrderExchangeDTO
  extends Omit<OrderDTO, "status" | "version" | "items"> {
  return_items: any[]
  additional_items: any[]
  no_notification?: boolean
  difference_due?: BigNumberValue
  return?: ReturnDTO
}

export type PaymentStatus =
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

export type FulfillmentStatus =
  | "not_fulfilled"
  | "partially_fulfilled"
  | "fulfilled"
  | "partially_shipped"
  | "shipped"
  | "partially_delivered"
  | "delivered"
  | "canceled"

export interface OrderDetailDTO extends OrderDTO {
  payment_collections: PaymentCollectionDTO[]
  payment_status: PaymentStatus
  fulfillments: FulfillmentDTO[]
  fulfillment_status: FulfillmentStatus
}

export interface OrderChangeDTO {
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
  change_type?: "return" | "exchange" | "claim" | "edit"
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
  order: OrderDTO
  /**
   * The associated return order
   *
   * @expandable
   */
  return_order: ReturnDTO
  /**
   * The associated exchange order
   *
   * @expandable
   */
  exchange: OrderExchangeDTO
  /**
   * The associated claim order
   *
   * @expandable
   */
  claim: OrderClaimDTO

  /**
   * The actions of the order change
   *
   * @expandable
   */
  actions: OrderChangeActionDTO[]
  /**
   * The status of the order change
   */
  status: string
  /**
   * The requested by of the order change
   */
  requested_by: string | null
  /**
   * When the order change was requested
   */
  requested_at: Date | string | null
  /**
   * The confirmed by of the order change
   */
  confirmed_by: string | null
  /**
   * When the order change was confirmed
   */
  confirmed_at: Date | string | null
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
  declined_at: Date | string | null
  /**
   * The canceled by of the order change
   */
  canceled_by: string | null
  /**
   * When the order change was canceled
   */
  canceled_at: Date | string | null
  /**
   * When the order change was created
   */
  created_at: Date | string
  /**
   * When the order change was updated
   */
  updated_at: Date | string
}

export interface OrderChangeActionDTO {
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
  order_change: OrderChangeDTO | null

  /**
   * The ID of the associated order
   */
  order_id: string | null
  /**
   * The associated order
   *
   * @expandable
   */
  order: OrderDTO | null
  /**
   * The reference of the order change action
   */
  reference: string
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

export interface OrderTransactionDTO {
  /**
   * The ID of the transaction
   */
  id: string
  /**
   * The ID of the associated order
   */
  order_id: string
  /**
   * The associated order
   *
   * @expandable
   */
  order: OrderDTO
  /**
   * The amount of the transaction
   */
  amount: BigNumberValue
  /**
   * The raw amount of the transaction
   */
  raw_amount: BigNumberRawValue
  /**
   * The currency code of the transaction
   */
  currency_code: string
  /**
   * The reference of the transaction
   */
  reference: string
  /**
   * The ID of the reference
   */
  reference_id: string
  /**
   * When the transaction was created
   */
  created_at: Date | string
  /**
   * When the transaction was updated
   */
  updated_at: Date | string
}

export interface OrderTransactionDTO {
  /**
   * The ID of the transaction
   */
  id: string
  /**
   * The ID of the associated order
   */
  order_id: string
  /**
   * The associated order
   *
   * @expandable
   */
  order: OrderDTO
  /**
   * The amount of the transaction
   */
  amount: BigNumberValue
  /**
   * The raw amount of the transaction
   */
  raw_amount: BigNumberRawValue
  /**
   * The currency code of the transaction
   */
  currency_code: string
  /**
   * The reference of the transaction
   */
  reference: string
  /**
   * The ID of the reference
   */
  reference_id: string
  /**
   * The metadata of the transaction
   */
  metadata: Record<string, unknown> | null
  /**
   * When the transaction was created
   */
  created_at: Date | string
  /**
   * When the transaction was updated
   */
  updated_at: Date | string
}

export interface OrderReturnReasonDTO {
  /**
   * The ID of the return reason
   */
  id: string
  /**
   * The unique value of the return reason
   */
  value: string
  /**
   * The label of the return reason
   */
  label: string
  /**
   * The description of the return reason
   */
  description?: string
  /**
   * The parent return reason ID
   */
  parent_return_reason_id?: string

  parent_return_reason?: OrderReturnReasonDTO

  return_reason_children?: OrderReturnReasonDTO[]

  /**
   * The metadata of the return reason
   */
  metadata: Record<string, unknown> | null
  /**
   * When the return reason was created
   */
  created_at: Date | string
  /**
   * When the return reason was updated
   */
  updated_at: Date | string
}

export interface FilterableOrderProps
  extends BaseFilterable<FilterableOrderProps> {
  id?: string | string[]

  sales_channel_id?: string | string[] | OperatorMap<string>
  customer_id?: string | string[] | OperatorMap<string>
  region_id?: string | string[] | OperatorMap<string>

  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}

export interface FilterableOrderAddressProps
  extends BaseFilterable<FilterableOrderAddressProps> {
  id?: string | string[]
}

export interface FilterableOrderLineItemProps
  extends BaseFilterable<FilterableOrderLineItemProps> {
  id?: string | string[]
  order_id?: string | string[]
  title?: string
  variant_id?: string | string[]
  product_id?: string | string[]
}

export interface FilterableOrderLineItemAdjustmentProps
  extends BaseFilterable<FilterableOrderLineItemAdjustmentProps> {
  id?: string | string[]
  item_id?: string | string[]
  promotion_id?: string | string[]
  provider_id?: string | string[]
  item?: FilterableOrderLineItemProps
}
export interface FilterableOrderShippingMethodProps
  extends BaseFilterable<FilterableOrderShippingMethodProps> {
  id?: string | string[]
  order_id?: string | string[]
  name?: string
  shipping_option_id?: string | string[]
}

export interface FilterableOrderShippingMethodAdjustmentProps
  extends BaseFilterable<FilterableOrderShippingMethodAdjustmentProps> {
  id?: string | string[]
  shipping_method_id?: string | string[]
  promotion_id?: string | string[]
  provider_id?: string | string[]
  shipping_method?: FilterableOrderShippingMethodProps
}

export interface FilterableOrderLineItemTaxLineProps
  extends BaseFilterable<FilterableOrderLineItemTaxLineProps> {
  id?: string | string[]
  description?: string
  code?: string | string[]
  tax_rate_id?: string | string[]
  provider_id?: string | string[]
  item_id?: string | string[]
  item?: FilterableOrderLineItemProps
}

export interface FilterableOrderShippingMethodTaxLineProps
  extends BaseFilterable<FilterableOrderShippingMethodTaxLineProps> {
  id?: string | string[]
  description?: string
  code?: string | string[]
  tax_rate_id?: string | string[]
  provider_id?: string | string[]
  shipping_method_id?: string | string[]
  shipping_method?: FilterableOrderShippingMethodProps
}

export interface FilterableOrderChangeProps
  extends BaseFilterable<FilterableOrderChangeProps> {
  id?: string | string[] | OperatorMap<string>
  order_id?: string | string[] | OperatorMap<string>
  status?: string | string[] | OperatorMap<string>
  requested_by?: string | string[] | OperatorMap<string>
  confirmed_by?: string | string[] | OperatorMap<string>
  declined_by?: string | string[] | OperatorMap<string>
  canceled_by?: string | string[] | OperatorMap<string>
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
  canceled_at?: OperatorMap<string>
}

export interface FilterableOrderChangeActionProps
  extends BaseFilterable<FilterableOrderChangeActionProps> {
  id?: string | string[] | OperatorMap<string>
  order_change_id?: string | string[] | OperatorMap<string>
  reference?: string | string[] | OperatorMap<string>
  reference_id?: string | string[] | OperatorMap<string>
}

export interface FilterableOrderTransactionProps
  extends BaseFilterable<FilterableOrderTransactionProps> {
  id?: string | string[] | OperatorMap<string>
  order_id?: string | string[] | OperatorMap<string>
  currency_code?: string | string[] | OperatorMap<string>
  reference?: string | string[] | OperatorMap<string>
  reference_id?: string | string[] | OperatorMap<string>

  created_at?: OperatorMap<string>
}

export interface FilterableOrderItemProps
  extends BaseFilterable<FilterableOrderItemProps> {
  id?: string | string[] | OperatorMap<string>
  order_id?: string | string[] | OperatorMap<string>
  version?: string | string[] | OperatorMap<string>
  item_id?: string | string[] | OperatorMap<string>
}

export interface FilterableOrderReturnReasonProps
  extends BaseFilterable<FilterableOrderReturnReasonProps> {
  id?: string | string[]
  value?: string | string[]
  label?: string
  description?: string
}

export interface FilterableReturnProps
  extends BaseFilterable<FilterableReturnProps> {
  id?: string | string[]
  order_id?: string | string[]
  claim_id?: string | string[]
  exchange_id?: string | string[]
  status?: string | string[]
  refund_amount?: string | string[]
}

export interface FilterableOrderClaimProps
  extends BaseFilterable<FilterableOrderClaimProps> {
  id?: string | string[]
  order_id?: string | string[]
  return_id?: string | string[]
}

export interface FilterableOrderExchangeProps
  extends BaseFilterable<FilterableOrderExchangeProps> {
  id?: string | string[]
  order_id?: string | string[]
  return_id?: string | string[]
  allow_backorder?: boolean
}

export interface OrderChangeReturn {
  items: {
    item_id: string
    order_id: string
    fulfilled_quantity: BigNumberInput
    shipped_quantity: BigNumberInput
    return_requested_quantity: BigNumberInput
    return_received_quantity: BigNumberInput
    return_dismissed_quantity: BigNumberInput
    written_off_quantity: BigNumberInput
    [key: string]: any
  }[]
  shippingMethods: any[]
}
