import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"
import { BigNumberRawValue } from "../totals"

type OrderSummary = {
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

type ItemSummary = {
  returnable_quantity: number
  ordered_quantity: number
  fulfilled_quantity: number
  return_requested_quantity: number
  return_received_quantity: number
  return_dismissed_quantity: number
  written_off_quantity: number
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
  amount: number
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
  unit_price: number

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

  total: number
  subtotal: number
  tax_total: number
  discount_total: number
  discount_tax_total: number
}

export interface OrderLineItemTotalsDTO {
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
   * The summary of the order line item.
   */
  summary?: ItemSummary

  /**
   * The date when the order line item was created.
   */
  created_at: Date

  /**
   * The date when the order line item was last updated.
   */
  updated_at: Date
}

export interface OrderDTO {
  /**
   * The ID of the order.
   */
  id: string
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
   * The associated line items.
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
   * The summary of the order totals.
   */
  summary?: OrderSummary
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
  /**
   * When the order was created.
   */
  created_at?: string | Date
  /**
   * When the order was updated.
   */
  updated_at?: string | Date
}

export interface OrderChangeDTO {
  /**
   * The ID of the order change
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
  order_change_id: string
  /**
   * The associated order change
   *
   * @expandable
   */
  order_change: OrderChangeDTO
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
  action: Record<string, unknown>
  /**
   * The metadata of the order change action
   */
  metadata?: Record<string, unknown> | null
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
  amount: number
  /**
   * The currency code of the transaction
   */
  currency_code: string
  /**
   * The reference of the transaction
   */
  reference: string
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
