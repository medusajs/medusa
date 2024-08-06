import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"
import { FulfillmentDTO } from "../fulfillment"
import { PaymentCollectionDTO } from "../payment"
import { BigNumberInput, BigNumberRawValue, BigNumberValue } from "../totals"
import { ClaimReason } from "./mutations"

/**
 * The change action's type.
 */
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

/**
 * @interface
 *
 * The order summary details.
 */
export type OrderSummaryDTO = {
  /**
   * The total of the order summary.
   */
  total: BigNumberValue

  /**
   * The subtotal of the order summary.
   */
  subtotal: BigNumberValue

  /**
   * The total tax of the order summary.
   */
  total_tax: BigNumberValue

  /**
   * The ordered total of the order summary.
   */
  ordered_total: BigNumberValue

  /**
   * The fulfilled total of the order summary.
   */
  fulfilled_total: BigNumberValue

  /**
   * The returned total of the order summary.
   */
  returned_total: BigNumberValue

  /**
   * The return request total of the order summary.
   */
  return_request_total: BigNumberValue

  /**
   * The write off total of the order summary.
   */
  write_off_total: BigNumberValue

  /**
   * The projected total of the order summary.
   */
  projected_total: BigNumberValue

  /**
   * The net total of the order summary.
   */
  net_total: BigNumberValue

  /**
   * The net subtotal of the order summary.
   */
  net_subtotal: BigNumberValue

  /**
   * The net total tax of the order summary.
   */
  net_total_tax: BigNumberValue

  /**
   * The balance of the order summary.
   */
  balance: BigNumberValue

  /**
   * The paid total of the order summary.
   */
  paid_total: BigNumberValue

  /**
   * The refunded total of the order summary.
   */
  refunded_total: BigNumberValue
}

/**
 * The adjustment line details.
 */
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

/**
 * The shipping method adjustment details.
 */
export interface OrderShippingMethodAdjustmentDTO
  extends OrderAdjustmentLineDTO {
  /**
   * The associated shipping method.
   *
   * @expandable
   */
  shipping_method: OrderShippingMethodDTO

  /**
   * The ID of the associated shipping method.
   */
  shipping_method_id: string
}

/**
 * The line item adjustment details.
 */
export interface OrderLineItemAdjustmentDTO extends OrderAdjustmentLineDTO {
  /**
   * The associated line item.
   *
   * @expandable
   */
  item: OrderLineItemDTO

  /**
   * The ID of the associated line item.
   */
  item_id: string
}

/**
 * The tax line details.
 */
export interface OrderTaxLineDTO {
  /**
   * The ID of the tax line.
   */
  id: string

  /**
   * The description of the tax line.
   */
  description?: string

  /**
   * The ID of the associated tax rate.
   */
  tax_rate_id?: string

  /**
   * The code of the tax line.
   */
  code: string

  /**
   * The rate of the tax line.
   */
  rate: number

  /**
   * The ID of the associated provider.
   */
  provider_id?: string

  /**
   * When the tax line was created.
   */
  created_at: Date | string

  /**
   * When the tax line was updated.
   */
  updated_at: Date | string
}

/**
 * The shipping method tax line details.
 */
export interface OrderShippingMethodTaxLineDTO extends OrderTaxLineDTO {
  /**
   * The associated shipping method.
   *
   * @expandable
   */
  shipping_method: OrderShippingMethodDTO

  /**
   * The ID of the associated shipping method.
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

/**
 * The line item tax line details.
 */
export interface OrderLineItemTaxLineDTO extends OrderTaxLineDTO {
  /**
   * The associated line item.
   *
   * @expandable
   */
  item: OrderLineItemDTO

  /**
   * The ID of the associated line item.
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

/**
 * The address details.
 */
export interface OrderAddressDTO {
  /**
   * The ID of the address.
   */
  id: string

  /**
   * The customer ID of the address.
   */
  customer_id?: string

  /**
   * The first name of the address.
   */
  first_name?: string

  /**
   * The last name of the address.
   */
  last_name?: string

  /**
   * The phone number of the address.
   */
  phone?: string

  /**
   * The company of the address.
   */
  company?: string

  /**
   * The first address line of the address.
   */
  address_1?: string

  /**
   * The second address line of the address.
   */
  address_2?: string

  /**
   * The city of the address.
   */
  city?: string

  /**
   * The country code of the address.
   */
  country_code?: string

  /**
   * The province/state of the address.
   */
  province?: string

  /**
   * The postal code of the address.
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

/**
 * The order shipping method details.
 */
export interface OrderShippingMethodDTO {
  /**
   * The ID of the shipping method.
   */
  id: string

  /**
   * The ID of the associated order.
   */
  order_id: string

  /**
   * The name of the shipping method.
   */
  name: string

  /**
   * The description of the shipping method.
   */
  description?: string

  /**
   * The price of the shipping method.
   */
  amount: BigNumberValue

  /**
   * The raw price of the shipping method.
   */
  raw_amount: BigNumberRawValue

  /**
   * Whether the shipping method price is tax inclusive or not.
   */
  is_tax_inclusive: boolean

  /**
   * The ID of the shipping option the method was created from.
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

/**
 * The order line item totals details.
 */
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

/**
 * The line item details.
 */
export interface OrderLineItemDTO extends OrderLineItemTotalsDTO {
  /**
   * The ID of the line item.
   */
  id: string

  /**
   * The title of the line item.
   */
  title: string

  /**
   * The subtitle of the line item.
   */
  subtitle?: string | null

  /**
   * The thumbnail of the line item.
   */
  thumbnail?: string | null

  /**
   * The ID of the variant associated with the line item.
   */
  variant_id?: string | null

  /**
   * The ID of the product associated with the line item.
   */
  product_id?: string | null

  /**
   * The title of the product associated with the line item.
   */
  product_title?: string | null

  /**
   * The description of the product associated with the line item.
   */
  product_description?: string | null

  /**
   * The subtitle of the product associated with the line item.
   */
  product_subtitle?: string | null

  /**
   * The type of the product associated with the line item.
   */
  product_type?: string | null

  /**
   * The collection of the product associated with the line item.
   */
  product_collection?: string | null

  /**
   * The handle of the product associated with the line item.
   */
  product_handle?: string | null

  /**
   * The SKU (stock keeping unit) of the variant associated with the line item.
   */
  variant_sku?: string | null

  /**
   * The barcode of the variant associated with the line item.
   */
  variant_barcode?: string | null

  /**
   * The title of the variant associated with the line item.
   */
  variant_title?: string | null

  /**
   * The option values of the variant associated with the line item.
   */
  variant_option_values?: Record<string, unknown> | null

  /**
   * Indicates whether the line item requires shipping.
   */
  requires_shipping: boolean

  /**
   * Indicates whether the line item is discountable.
   */
  is_discountable: boolean

  /**
   * Indicates whether the line item price is tax inclusive.
   */
  is_tax_inclusive: boolean

  /**
   * The compare at unit price of the line item.
   */
  compare_at_unit_price?: number

  /**
   * The raw compare at unit price of the line item.
   */
  raw_compare_at_unit_price?: BigNumberRawValue

  /**
   * The unit price of the line item.
   */
  unit_price: number

  /**
   * The raw unit price of the line item.
   */
  raw_unit_price: BigNumberRawValue

  /**
   * The quantity of the line item.
   */
  quantity: number

  /**
   * The raw quantity of the line item.
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
   * The date when the line item was created.
   */
  created_at: Date

  /**
   * The date when the line item was last updated.
   */
  updated_at: Date

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The order item details.
 */
export interface OrderItemDTO {
  /**
   * The ID of the order item.
   */
  id: string

  /**
   * The ID of the associated item.
   */
  item_id: string

  /**
   * The associated line item.
   *
   * @expandable
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

/**
 * The order's status.
 */
type OrderStatus =
  | "pending"
  | "completed"
  | "draft"
  | "archived"
  | "canceled"
  | "requires_action"

/**
 * The order details.
 */
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
   *
   * @expandable
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
   *
   * @expandable
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

/**
 * The return's status.
 */
type ReturnStatus = "requested" | "received" | "partially_received" | "canceled"

/**
 * The return details.
 */
export interface ReturnDTO
  extends Omit<OrderDTO, "status" | "version" | "items"> {
  /**
   * The ID of the return.
   */
  id: string

  /**
   * The status of the return.
   */
  status: ReturnStatus

  /**
   * The refund amount of the return.
   */
  refund_amount?: BigNumberValue

  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The items of the return
   */
  items: OrderReturnItemDTO[]
}

/**
 * The order return item details.
 */
export interface OrderReturnItemDTO {
  /**
   * The ID of the order return item.
   */
  id: string

  /**
   * The associated return's ID.
   */
  return_id: string

  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The associated line item's ID.
   */
  item_id: string

  /**
   * The associated reason's ID.
   */
  reason_id?: string | null

  /**
   * The quantity of the item to return.
   */
  quantity: number

  /**
   * The raw quantity of the item to return.
   */
  raw_quantity: BigNumberRawValue

  /**
   * The received quantity of the return item.
   */
  received_quantity?: number

  /**
   * The raw received quantity of the return item.
   */
  raw_received_quantity?: BigNumberRawValue

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The creation date of the return item.
   */
  created_at?: Date | string

  /**
   * The update date of the return item.
   */
  updated_at?: Date | string
}

/**
 * The order claim item details.
 */
export interface OrderClaimItemDTO {
  /**
   * The ID of the order claim item.
   */
  id: string

  /**
   * The associated claim's ID.
   */
  claim_id: string

  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The quantity of the order claim item
   */
  quantity: number

  /**
   * The reason of the order claim item
   */
  reason: ClaimReason

  /**
   * The raw quantity of the order claim item
   */
  raw_quantity: BigNumberRawValue

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The creation date of the order claim item
   */
  created_at?: Date | string

  /**
   * The update date of the order claim item
   */
  updated_at?: Date | string
}

/**
 * The order claim item image details.
 */
export interface OrderClaimItemImageDTO {
  /**
   * The ID of the order claim item image.
   */
  id: string

  /**
   * The associated claim item's ID.
   */
  claim_item_id: string

  /**
   * The url of the order claim item image
   */
  url: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The creation date of the order claim item image
   */
  created_at?: Date | string

  /**
   * The update date of the order claim item image
   */
  updated_at?: Date | string
}

/**
 * The order exchange item details.
 */
export interface OrderExchangeItemDTO {
  /**
   * The ID of the order exchange item.
   */
  id: string

  /**
   * The associated exchange's ID.
   */
  exchange_id: string

  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The associated item's ID.
   */
  item_id: string

  /**
   * The quantity of the order exchange item
   */
  quantity: number

  /**
   * The raw quantity of the order exchange item
   */
  raw_quantity: BigNumberRawValue

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The creation date of the order exchange item
   */
  created_at?: Date | string

  /**
   * The update date of the order exchange item
   */
  updated_at?: Date | string
}

/**
 * The claim details.
 */
export interface OrderClaimDTO
  extends Omit<OrderDTO, "status" | "version" | "items"> {
  /**
   * The ID of the associated order.
   */
  order_id: string

  /**
   * The items to be received from the customer
   * if the claim's type is `replace`.
   */
  claim_items: any[]

  /**
   * The items to be sent to the customer
   * if the claim's type is `replace`.
   */
  additional_items: any[]

  /**
   * The associated return, if the claim's type is `replace`.
   */
  return?: ReturnDTO

  /**
   * The ID of the associated return, if the claim's type is `replace`.
   */
  return_id?: string

  /**
   * Whether the customer should receive notifications related
   * to updates on the claim.
   */
  no_notification?: boolean

  /**
   * The refund amount of the claim.
   */
  refund_amount?: BigNumberValue
}

/**
 * The exchange details.
 */
export interface OrderExchangeDTO
  extends Omit<OrderDTO, "status" | "version" | "items"> {
  /**
   * The associated order's ID.
   */
  order_id: string

  /**
   * The items to be returned from the customer.
   */
  return_items: any[]

  /**
   * The items to be sent to the customer.
   */
  additional_items: any[]

  /**
   * Whether the customer should receive notifications related
   * to updates on the exchange.
   */
  no_notification?: boolean

  /**
   * The difference due of the order exchange.
   *
   * - If less than `0`, the merchant owes the customer this amount.
   * - If greater than `0`, the customer owes the merchange this amount.
   * - If equal to `0`, no payment is required by either sides.
   */
  difference_due?: BigNumberValue

  /**
   * The associated return.
   */
  return?: ReturnDTO

  /**
   * The associated return's ID.
   */
  return_id?: string
}

/**
 * The payment's status.
 */
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

/**
 * The fulfillment's status.
 */
export type FulfillmentStatus =
  | "not_fulfilled"
  | "partially_fulfilled"
  | "fulfilled"
  | "partially_shipped"
  | "shipped"
  | "partially_delivered"
  | "delivered"
  | "canceled"

/**
 * The data of the order details.
 */
export interface OrderDetailDTO extends OrderDTO {
  /**
   * The associated payment collections.
   *
   * @expandable
   */
  payment_collections: PaymentCollectionDTO[]

  /**
   * The payment status of the order detail.
   */
  payment_status: PaymentStatus

  /**
   * The associated fulfillments.
   *
   * @expandable
   */
  fulfillments: FulfillmentDTO[]

  /**
   * The fulfillment status of the order detail.
   */
  fulfillment_status: FulfillmentStatus
}

/**
 * The order change details.
 */
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

/**
 * The order change action details.
 */
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

/**
 * The order transaction details.
 */
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

/**
 * The order transaction details.
 */
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

/**
 * The order return reason details.
 */
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

  /**
   * The associated order return reason.
   */
  parent_return_reason?: OrderReturnReasonDTO

  /**
   * The return reason children of the order return reason.
   */
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

/**
 * The filters to apply on the retrieved orders.
 */
export interface FilterableOrderProps
  extends BaseFilterable<FilterableOrderProps> {
  /**
   * The IDs to filter the orders by.
   */
  id?: string | string[]

  /**
   * Filter orders by their associated sales channel's ID.
   */
  sales_channel_id?: string | string[] | OperatorMap<string>

  /**
   * Filter orders by their associated customer's ID.
   */
  customer_id?: string | string[] | OperatorMap<string>

  /**
   * Filter orders by their associated region's ID.
   */
  region_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the orders by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter orders by their update date.
   */
  updated_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved order addresss.
 */
export interface FilterableOrderAddressProps
  extends BaseFilterable<FilterableOrderAddressProps> {
  /**
   * The IDs to filter the order addresss by.
   */
  id?: string | string[]
}

/**
 * The filters to apply on the retrieved order line items.
 */
export interface FilterableOrderLineItemProps
  extends BaseFilterable<FilterableOrderLineItemProps> {
  /**
   * The IDs to filter the order line items by.
   */
  id?: string | string[]

  /**
   * Filter line items by their associated order's ID.
   */
  order_id?: string | string[]

  /**
   * Filter by line items' title.
   */
  title?: string

  /**
   * Filter line items by their associated variant's ID.
   */
  variant_id?: string | string[]

  /**
   * Filter line items by their associated product's ID.
   */
  product_id?: string | string[]
}

/**
 * The filters to apply on the retrieved line item adjustments.
 */
export interface FilterableOrderLineItemAdjustmentProps
  extends BaseFilterable<FilterableOrderLineItemAdjustmentProps> {
  /**
   * The IDs to filter the line item adjustments by.
   */
  id?: string | string[]

  /**
   * Filter adjustments by their associated item's ID.
   */
  item_id?: string | string[]

  /**
   * Filter adjustments by their associated promotion's ID.
   */
  promotion_id?: string | string[]

  /**
   * Filter adjustments by their associated provider's ID.
   */
  provider_id?: string | string[]

  /**
   * The filters to apply on the associated line items.
   */
  item?: FilterableOrderLineItemProps
}

/**
 * The filters to apply on the retrieved shipping methods.
 */
export interface FilterableOrderShippingMethodProps
  extends BaseFilterable<FilterableOrderShippingMethodProps> {
  /**
   * The IDs to filter the shipping methods by.
   */
  id?: string | string[]

  /**
   * Filter the shipping methods by their associated order's ID.
   */
  order_id?: string | string[]

  /**
   * Filter shipping methods by their name.
   */
  name?: string

  /**
   * Filter the shipping methods by their associated shipping option's ID.
   */
  shipping_option_id?: string | string[]
}

/**
 * The filters to apply on the retrieved shipping method adjustments.
 */
export interface FilterableOrderShippingMethodAdjustmentProps
  extends BaseFilterable<FilterableOrderShippingMethodAdjustmentProps> {
  /**
   * The IDs to filter the shipping method adjustments by.
   */
  id?: string | string[]

  /**
   * Filter the adjustments by their associated shipping method's ID.
   */
  shipping_method_id?: string | string[]

  /**
   * Filter the adjustments by their associated promotion's ID.
   */
  promotion_id?: string | string[]

  /**
   * Filter the adjustments by their associated provider's ID.
   */
  provider_id?: string | string[]

  /**
   * The filters to apply on the associated shipping methods.
   */
  shipping_method?: FilterableOrderShippingMethodProps
}

/**
 * The filters to apply on the retrieved line item tax lines.
 */
export interface FilterableOrderLineItemTaxLineProps
  extends BaseFilterable<FilterableOrderLineItemTaxLineProps> {
  /**
   * The IDs to filter the line item tax lines by.
   */
  id?: string | string[]

  /**
   * Filter line item tax lines by their description.
   */
  description?: string

  /**
   * Filter line item tax lines by their code.
   */
  code?: string | string[]

  /**
   * Filter the tax lines by their associated tax rate's ID.
   */
  tax_rate_id?: string | string[]

  /**
   * Filter the tax lines by their associated provider's ID.
   */
  provider_id?: string | string[]

  /**
   * Filter the tax lines by their associated item's ID.
   */
  item_id?: string | string[]

  /**
   * The filters to apply on the associated line items.
   */
  item?: FilterableOrderLineItemProps
}

/**
 * The filters to apply on the retrieved shipping method tax lines.
 */
export interface FilterableOrderShippingMethodTaxLineProps
  extends BaseFilterable<FilterableOrderShippingMethodTaxLineProps> {
  /**
   * The IDs to filter the order shipping method tax lines by.
   */
  id?: string | string[]

  /**
   * Filter the tax lines by their description
   */
  description?: string

  /**
   * Filter the tax lines by their code.
   */
  code?: string | string[]

  /**
   * Filter the tax lines by their associated tax rate's ID.
   */
  tax_rate_id?: string | string[]

  /**
   * Filter the tax lines by their associated provider's ID.
   */
  provider_id?: string | string[]

  /**
   * Filter the tax lines by their associated shipping method's ID.
   */
  shipping_method_id?: string | string[]

  /**
   * The filters to apply on the retrieved associated shipping methods.
   */
  shipping_method?: FilterableOrderShippingMethodProps
}

/**
 * The filters to apply on the retrieved order changes.
 */
export interface FilterableOrderChangeProps
  extends BaseFilterable<FilterableOrderChangeProps> {
  /**
   * The IDs to filter the order changes by.
   */
  id?: string | string[] | OperatorMap<string>

  /**
   * Filter the changes by their associated order's ID.
   */
  order_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the order changes by their status.
   */
  status?: string | string[] | OperatorMap<string>

  /**
   * Filter the order changes by who requested them.
   */
  requested_by?: string | string[] | OperatorMap<string>

  /**
   * Filter the order changes by who confirmed them.
   */
  confirmed_by?: string | string[] | OperatorMap<string>

  /**
   * Filter the order changes by who declined them.
   */
  declined_by?: string | string[] | OperatorMap<string>

  /**
   * Filter the order changes by who canceled them.
   */
  canceled_by?: string | string[] | OperatorMap<string>

  /**
   * Filter the order changes by their creation date.
   */
  created_at?: OperatorMap<string>

  /**
   * Filter the order changes by their update date.
   */
  updated_at?: OperatorMap<string>

  /**
   * Filter the order changes by their deletion date.
   */
  deleted_at?: OperatorMap<string>

  /**
   * Filter the order changes by their cancelation date.
   */
  canceled_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved order change actions.
 */
export interface FilterableOrderChangeActionProps
  extends BaseFilterable<FilterableOrderChangeActionProps> {
  /**
   * The IDs to filter the order change actions by.
   */
  id?: string | string[] | OperatorMap<string>

  /**
   * Filter the actions by their associated order change's ID.
   */
  order_change_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the actions by their reference.
   */
  reference?: string | string[] | OperatorMap<string>

  /**
   * Filter the actions by their reference ID.
   */
  reference_id?: string | string[] | OperatorMap<string>
}

/**
 * The filters to apply on the retrieved transactions.
 */
export interface FilterableOrderTransactionProps
  extends BaseFilterable<FilterableOrderTransactionProps> {
  /**
   * The IDs to filter the transactions by.
   */
  id?: string | string[] | OperatorMap<string>

  /**
   * Filter the transactions by their associated order's ID.
   */
  order_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the transactions by their currency code.
   */
  currency_code?: string | string[] | OperatorMap<string>

  /**
   * Filter the transactions by their reference.
   */
  reference?: string | string[] | OperatorMap<string>

  /**
   * Filter the transactions by their associated reference's ID.
   */
  reference_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the transactions by their creation date.
   */
  created_at?: OperatorMap<string>
}

/**
 * The filters to apply on the retrieved order items.
 */
export interface FilterableOrderItemProps
  extends BaseFilterable<FilterableOrderItemProps> {
  /**
   * The IDs to filter the order items by.
   */
  id?: string | string[] | OperatorMap<string>

  /**
   * Filter the order items by their associated order's ID.
   */
  order_id?: string | string[] | OperatorMap<string>

  /**
   * Filter the order items by their version.
   */
  version?: string | string[] | OperatorMap<string>

  /**
   * Filter the order items by their associated line item's ID.
   */
  item_id?: string | string[] | OperatorMap<string>
}

/**
 * The filters to apply on the retrieved return reasons.
 */
export interface FilterableOrderReturnReasonProps
  extends BaseFilterable<FilterableOrderReturnReasonProps> {
  /**
   * The IDs to filter the return reasons by.
   */
  id?: string | string[]

  /**
   * Filter the return reason by their value.
   */
  value?: string | string[]

  /**
   * Filter the return reason by their label.
   */
  label?: string

  /**
   * Filter the return reason by their description.
   */
  description?: string
}

/**
 * The filters to apply on the retrieved returns.
 */
export interface FilterableReturnProps
  extends BaseFilterable<FilterableReturnProps> {
  /**
   * The IDs to filter the returns by.
   */
  id?: string | string[]

  /**
   * Filter the returns by their associated order's ID.
   */
  order_id?: string | string[]

  /**
   * Filter the returns by their associated claim's ID.
   */
  claim_id?: string | string[]

  /**
   * Filter the returns by their associated exchange's ID.
   */
  exchange_id?: string | string[]

  /**
   * Filter the returns by their status.
   */
  status?: string | string[]

  /**
   * Filter the returns by their refund amount.
   */
  refund_amount?: string | string[]
}

/**
 * The filters to apply on the retrieved claims.
 */
export interface FilterableOrderClaimProps
  extends BaseFilterable<FilterableOrderClaimProps> {
  /**
   * The IDs to filter the claims by.
   */
  id?: string | string[]

  /**
   * Filter the claims by their associated order's ID.
   */
  order_id?: string | string[]

  /**
   * Filter the claims by their associated return's ID.
   */
  return_id?: string | string[]
}

/**
 * The filters to apply on the retrieved exchanges.
 */
export interface FilterableOrderExchangeProps
  extends BaseFilterable<FilterableOrderExchangeProps> {
  /**
   * The IDs to filter the exchanges by.
   */
  id?: string | string[]

  /**
   * Filter the exchanges by their associated order's ID.
   */
  order_id?: string | string[]

  /**
   * Filter the exchanges by their associated return's ID.
   */
  return_id?: string | string[]

  /**
   * Filter the exchanges by whether backorders are allowed.
   */
  allow_backorder?: boolean
}

/**
 * The details of changes made on orders.
 */
export interface OrderChangeReturn {
  /**
   * The list of items created or updated.
   */
  items: {
    /**
     * The associated item's ID.
     */
    item_id: string

    /**
     * The associated order's ID.
     */
    order_id: string

    /**
     * The item's fulfilled quantity.
     */
    fulfilled_quantity: BigNumberInput

    /**
     * The item's shipped quantity.
     */
    shipped_quantity: BigNumberInput

    /**
     * The item's request quantity to be returned.
     */
    return_requested_quantity: BigNumberInput

    /**
     * The item's quantity that was received through a return.
     */
    return_received_quantity: BigNumberInput

    /**
     * The item's quantity that was dismissed in a return.
     */
    return_dismissed_quantity: BigNumberInput

    /**
     * The item's quantity that was written off.
     */
    written_off_quantity: BigNumberInput

    /**
     * Other details updated in an item.
     */
    [key: string]: any
  }[]

  /**
   * The list of shipping methods created or updated.
   */
  shippingMethods: any[]
}
