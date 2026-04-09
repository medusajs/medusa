export interface AdminUpdateOrder {
  /**
   * The order's email.
   */
  email?: string
  /**
   * The order's shipping address.
   */
  shipping_address?: OrderAddress
  /**
   * The order's billing address.
   */
  billing_address?: OrderAddress
  /**
   * The order's locale code. Items in the 
   * order will be translated to the given locale,
   * if translations are available.
   * 
   * @since 2.12.3
   */
  locale?: string | null
  /**
   * The order's metadata.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateOrderFulfillment {
  /**
   * The items to add to the fulfillment.
   */
  items: {
    /**
     * The order item's ID.
     */
    id: string
    /**
     * The quantity to fulfill.
     */
    quantity: number
  }[]
  /**
   * The ID of the stock location
   * to fulfill the items from.
   */
  location_id?: string
  /**
   * The ID of the shipping option to use for the fulfillment.
   * Overrides the shipping option selected by the customer.
   */
  shipping_option_id?: string
  /**
   * Whether to notify the customer about this change.
   */
  no_notification?: boolean
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, any>
}

export interface AdminCreateOrderShipment {
  /**
   * The fulfillment items to create a shipment for.
   */
  items: {
    /**
     * The item's ID.
     */
    id: string
    /**
     * The quantity to ship.
     */
    quantity: number
  }[]
  /**
   * The shipment's labels.
   */
  labels?: {
    /**
     * The label's tracking number.
     */
    tracking_number: string
    /**
     * The label's tracking URL.
     */
    tracking_url: string
    /**
     * The label's URL.
     */
    label_url: string
  }[]
  /**
   * Whether to notify the customer about this change.
   */
  no_notification?: boolean
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, any>
}

export interface AdminCancelOrderFulfillment {
  /**
   * Whether to notify the customer about this change.
   */
  no_notification?: boolean
}

export interface AdminRequestOrderTransfer {
  /**
   * The ID of the customer to transfer the order to.
   */
  customer_id: string
  /**
   * An internal note viewed by admins only.
   */
  internal_note?: string
  /**
   * A description for the transfer request.
   */
  description?: string
}

export interface OrderAddress {
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
}

export interface AdminCreateOrderCreditLine {
  /**
   * The amount of the credit line.
   */
  amount: number
  /**
   * The name of the table this credit line is associated with.
   */
  reference: string
  /**
   * The ID of the reference entity in the reference table.
   */
  reference_id: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateOrderChange {
  /**
   * Whether to carry over promotions to outbound exchange items.
   */
  carry_over_promotions?: boolean
}