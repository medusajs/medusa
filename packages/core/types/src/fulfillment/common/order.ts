import { OrderSummaryDTO } from "../../order/common"
import { BigNumberRawValue, BigNumberValue } from "../../totals"

/**
 * The order's status.
 */
type FulfillmentOrderStatus =
  | "pending"
  | "completed"
  | "draft"
  | "archived"
  | "canceled"
  | "requires_action"

export interface FulfillmentOrderDTO {
  /**
   * The ID of the order.
   */
  id: string

  /**
   * The version of the order.
   */
  version: number

  /**
   * The order's display ID.
   */
  display_id: number

  /**
   * The status of the order.
   */
  status: FulfillmentOrderStatus

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
  shipping_address?: FulfillmentOrderAddressDTO

  /**
   * The associated billing address.
   *
   * @expandable
   */
  billing_address?: FulfillmentOrderAddressDTO

  /**
   * The associated order details / line items.
   *
   * @expandable
   */
  items?: FulfillmentOrderLineItemDTO[]

  /**
   * The associated shipping methods
   *
   * @expandable
   */
  shipping_methods?: FulfillmentOrderShippingMethodDTO[]

  /**
   * The summary of the order totals.
   *
   * @expandable
   */
  summary?: FulfillmentOrderSummaryDTO

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
  created_at: string | Date

  /**
   * When the order was updated.
   */
  updated_at: string | Date

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
   * The discount subtotal of the order.
   */
  discount_subtotal: BigNumberValue

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
   *
   * @ignore
   */
  raw_original_item_total: BigNumberRawValue

  /**
   * The raw original item subtotal of the order.
   *
   * @ignore
   */
  raw_original_item_subtotal: BigNumberRawValue

  /**
   * The raw original item tax total of the order.
   *
   * @ignore
   */
  raw_original_item_tax_total: BigNumberRawValue

  /**
   * The raw item total of the order.
   *
   * @ignore
   */
  raw_item_total: BigNumberRawValue

  /**
   * The raw item subtotal of the order.
   *
   * @ignore
   */
  raw_item_subtotal: BigNumberRawValue

  /**
   * The raw item tax total of the order.
   *
   * @ignore
   */
  raw_item_tax_total: BigNumberRawValue

  /**
   * The raw original total of the order.
   *
   * @ignore
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the order.
   *
   * @ignore
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the order.
   *
   * @ignore
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw total of the order.
   *
   * @ignore
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the order. (Excluding taxes)
   *
   * @ignore
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the order.
   *
   * @ignore
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the order.
   *
   * @ignore
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the order.
   *
   * @ignore
   */
  raw_discount_tax_total: BigNumberRawValue

  /**
   * The raw gift card total of the order.
   *
   * @ignore
   */
  raw_gift_card_total: BigNumberRawValue

  /**
   * The raw gift card tax total of the order.
   *
   * @ignore
   */
  raw_gift_card_tax_total: BigNumberRawValue

  /**
   * The raw shipping total of the order.
   *
   * @ignore
   */
  raw_shipping_total: BigNumberRawValue

  /**
   * The raw shipping subtotal of the order.
   *
   * @ignore
   */
  raw_shipping_subtotal: BigNumberRawValue

  /**
   * The raw shipping tax total of the order.
   *
   * @ignore
   */
  raw_shipping_tax_total: BigNumberRawValue

  /**
   * The raw original shipping total of the order.
   *
   * @ignore
   */
  raw_original_shipping_total: BigNumberRawValue

  /**
   * The raw original shipping subtotal of the order.
   *
   * @ignore
   */
  raw_original_shipping_subtotal: BigNumberRawValue

  /**
   * The raw original shipping tax total of the order.
   *
   * @ignore
   */
  raw_original_shipping_tax_total: BigNumberRawValue
}

/**
 * The address details.
 */
interface FulfillmentOrderAddressDTO {
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
   * The lower-case [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) province/state of the address.
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
 * The order line item totals details.
 */
interface FulfillmentOrderLineItemTotalsDTO {
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
   *
   * @ignore
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the order line item.
   *
   * @ignore
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the order line item.
   *
   * @ignore
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw item total of the order line item.
   *
   * @ignore
   */
  raw_item_total: BigNumberRawValue

  /**
   * The raw item subtotal of the order line item.
   *
   * @ignore
   */
  raw_item_subtotal: BigNumberRawValue

  /**
   * The raw item tax total of the order line item.
   *
   * @ignore
   */
  raw_item_tax_total: BigNumberRawValue

  /**
   * The raw total of the order line item.
   *
   * @ignore
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the order line item.
   *
   * @ignore
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the order line item.
   *
   * @ignore
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the order line item.
   *
   * @ignore
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the order line item.
   *
   * @ignore
   */
  raw_discount_tax_total: BigNumberRawValue

  /**
   * The raw refundable total of the order line item..
   *
   * @ignore
   */
  raw_refundable_total: BigNumberRawValue

  /**
   * The raw  refundable total per unit of the order line item.
   *
   * @ignore
   */
  raw_refundable_total_per_unit: BigNumberRawValue
}

/**
 * The line item details.
 */
interface FulfillmentOrderLineItemDTO extends FulfillmentOrderLineItemTotalsDTO {
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
   * The ID of the type of the product associated with the line item.
   */
  product_type_id?: string | null

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
   *
   * @ignore
   */
  raw_compare_at_unit_price?: BigNumberRawValue

  /**
   * The unit price of the line item.
   */
  unit_price: number

  /**
   * The raw unit price of the line item.
   *
   * @ignore
   */
  raw_unit_price: BigNumberRawValue

  /**
   * The quantity of the line item.
   */
  quantity: number

  /**
   * The raw quantity of the line item.
   *
   * @ignore
   */
  raw_quantity: BigNumberRawValue

  /**
   * The details of the item
   */
  detail: FulfillmentOrderItemDTO

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
interface FulfillmentOrderItemDTO {
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
  item: FulfillmentOrderLineItemDTO

  /**
   * The quantity of the order line item.
   */
  quantity: number

  /**
   * The raw quantity of the order line item.
   *
   * @ignore
   */
  raw_quantity: BigNumberRawValue

  /**
   * The fulfilled quantity of the order line item.
   */
  fulfilled_quantity: number

  /**
   * The raw fulfilled quantity of the order line item.
   *
   * @ignore
   */
  raw_fulfilled_quantity: BigNumberRawValue

  /**
   * The delivered quantity of the order line item.
   */
  delivered_quantity: number

  /**
   * The raw delivered quantity of the order line item.
   *
   * @ignore
   */
  raw_delivered_quantity: BigNumberRawValue

  /**
   * The shipped quantity of the order line item.
   */
  shipped_quantity: number

  /**
   * The raw shipped quantity of the order line item.
   *
   * @ignore
   */
  raw_shipped_quantity: BigNumberRawValue

  /**
   * The quantity of return requested for the order line item.
   */
  return_requested_quantity: number

  /**
   * The raw quantity of return requested for the order line item.
   *
   * @ignore
   */
  raw_return_requested_quantity: BigNumberRawValue

  /**
   * The quantity of return received for the order line item.
   */
  return_received_quantity: number

  /**
   * The raw quantity of return received for the order line item.
   *
   * @ignore
   */
  raw_return_received_quantity: BigNumberRawValue

  /**
   * The quantity of return dismissed for the order line item.
   */
  return_dismissed_quantity: number

  /**
   * The raw quantity of return dismissed for the order line item.
   *
   * @ignore
   */
  raw_return_dismissed_quantity: BigNumberRawValue

  /**
   * The quantity of written off for the order line item.
   */
  written_off_quantity: number

  /**
   * The raw quantity of written off for the order line item.
   *
   * @ignore
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
 * The order shipping method details.
 */
interface FulfillmentOrderShippingMethodDTO {
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
   *
   * @ignore
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
   *
   * @ignore
   */
  raw_original_total: BigNumberRawValue

  /**
   * The raw original subtotal of the order shipping method.
   *
   * @ignore
   */
  raw_original_subtotal: BigNumberRawValue

  /**
   * The raw original tax total of the order shipping method.
   *
   * @ignore
   */
  raw_original_tax_total: BigNumberRawValue

  /**
   * The raw total of the order shipping method.
   *
   * @ignore
   */
  raw_total: BigNumberRawValue

  /**
   * The raw subtotal of the order shipping method.
   *
   * @ignore
   */
  raw_subtotal: BigNumberRawValue

  /**
   * The raw tax total of the order shipping method.
   *
   * @ignore
   */
  raw_tax_total: BigNumberRawValue

  /**
   * The raw discount total of the order shipping method.
   *
   * @ignore
   */
  raw_discount_total: BigNumberRawValue

  /**
   * The raw discount tax total of the order shipping method.
   *
   * @ignore
   */
  raw_discount_tax_total: BigNumberRawValue
}

/**
 * @interface
 *
 * The order summary details.
 */
type FulfillmentOrderSummaryDTO = OrderSummaryDTO
