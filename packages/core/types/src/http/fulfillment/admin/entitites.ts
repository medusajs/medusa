import { AdminFulfillmentProvider } from "../../fulfillment-provider"

export interface AdminFulfillmentItem {
  /**
   * The fulfillment item's ID.
   */
  id: string
  /**
   * The fulfillment item's title.
   */
  title: string
  /**
   * The fulfillment item's quantity.
   */
  quantity: number
  /**
   * The fulfillment item's SKU.
   */
  sku: string
  /**
   * The fulfillment item's barcode.
   */
  barcode: string
  /**
   * The ID of the associated line item in an order.
   */
  line_item_id: string | null
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id: string | null
  /**
   * The ID of the fulfillment that the item belongs to.
   */
  fulfillment_id: string
  /**
   * The date the fulfillment item was created.
   */
  created_at: string
  /**
   * The date the fulfillment item was updated.
   */
  updated_at: string
  /**
   * The date the fulfillment item was deleted.
   */
  deleted_at: string | null
}

export interface AdminFulfillmentLabel {
  id: string
  tracking_number: string
  tracking_url: string
  label_url: string
  fulfillment_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminFulfillmentAddress {
  /**
   * The address's ID.
   */
  id: string
  /**
   * The ID of the fulfillment this address belongs to.
   */
  fulfillment_id: string | null
  /**
   * The address's company.
   */
  company: string | null
  /**
   * The address's first name.
   */
  first_name: string | null
  /**
   * The address's last name.
   */
  last_name: string | null
  /**
   * The address's first line.
   */
  address_1: string | null
  /**
   * The address's last line.
   */
  address_2: string | null
  /**
   * The address's city.
   */
  city: string | null
  /**
   * The address's country code.
   * 
   * @example
   * us
   */
  country_code: string | null
  /**
   * The address's province.
   */
  province: string | null
  /**
   * The address's postal code.
   */
  postal_code: string | null
  /**
   * The address's phone number.
   */
  phone: string | null
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the address was created.
   */
  created_at: string
  /**
   * The date the address was updated.
   */
  updated_at: string
  /**
   * The date the address was deleted.
   */
  deleted_at: string | null
}

export interface AdminFulfillment {
  /**
   * The fulfillment's ID.
   */
  id: string
  /**
   * The ID of the stock location the items
   * are delivered from.
   */
  location_id: string
  /**
   * The ID of the fulfillment provider
   * handling the fulfillment.
   */
  provider_id: string
  /**
   * The ID of the associated shipping option.
   */
  shipping_option_id: string | null
  /**
   * The associated fulfillment provider's details.
   */
  provider: AdminFulfillmentProvider
  /**
   * The address to deliver the items to.
   */
  delivery_address: AdminFulfillmentAddress
  /**
   * The items to fulfill.
   */
  items: AdminFulfillmentItem[]
  /**
   * The fulfillment's labels.
   */
  labels: AdminFulfillmentLabel[]
  /**
   * The date the fulfillment items were packed.
   */
  packed_at: string | null
  /**
   * The date the fulfillment items were shipped.
   */
  shipped_at: string | null
  /**
   * The date the fulfillment items were delivered.
   */
  delivered_at: string | null
  /**
   * The date the fulfillment was canceled.
   */
  canceled_at: string | null
  /**
   * Data useful for the fulfillment provider handling the fulfillment.
   * 
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment#data-property).
   */
  data: Record<string, unknown> | null
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the fulfillment was created.
   */
  created_at: string
  /**
   * The date the fulfillment was updated.
   */
  updated_at: string
  /**
   * The date the fulfillment was deleted.
   */
  deleted_at: string | null
}
