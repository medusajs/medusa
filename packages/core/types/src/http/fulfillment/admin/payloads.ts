interface AdminCreateFulfillmentItem {
  /**
   * The item's name.
   */
  title: string
  /**
   * The item's SKU.
   */
  sku: string
  /**
   * The item's quantity.
   */
  quantity: number
  /**
   * The item's barcode.
   */
  barcode: string
  /**
   * The ID of the associated line item in an order.
   */
  line_item_id?: string
  /**
   * The ID of the associated inventory item.
   */
  inventory_item_id?: string
}

interface AdminCreateFulfillmentLabel {
  /**
   * The tracking number of the fulfillment's shipment.
   */
  tracking_number: string
  /**
   * The tracking URL of the fulfillment's shipment.
   */
  tracking_url: string
  /**
   * The label URL of the fulfillment's shipment.
   */
  label_url: string
}

interface AdminFulfillmentDeliveryAddress {
  /**
   * The address's first name.
   */
  first_name?: string
  /**
   * The address's last name.
   */
  last_name?: string
  /**
   * The address's phone number.
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
   * @example
   * us
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
  metadata?: Record<string, string> | null
}

export interface AdminCreateFulfillment {
  /**
   * The ID of the location the items are fulfilled from.
   */
  location_id: string
  /**
   * The ID of the fulfillment provider used to handle the fulfillment.
   */
  provider_id: string
  /**
   * The address to deliver items to.
   */
  delivery_address: AdminFulfillmentDeliveryAddress
  /**
   * The items to fulfill.
   */
  items: AdminCreateFulfillmentItem[]
  /**
   * The fulfillment's shipment labels.
   */
  labels: AdminCreateFulfillmentLabel[]
  /**
   * The ID of the order the fulfillment is created for.
   */
  order_id: string
  /**
   * The ID of the associated shipping option.
   */
  shipping_option_id?: string | null
  /**
   * Data useful for the fulfillment provider handling the fulfillment.
   * 
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment#data-property).
   */
  data?: Record<string, unknown> | null
  /**
   * The date the fulfillment items were packed.
   */
  packed_at?: Date | null
  /**
   * The date the fulfillment items were shipped.
   */
  shipped_at?: Date | null
  /**
   * The date the fulfillment items were delivered.
   */
  delivered_at?: Date | null
  /**
   * The date the fulfillment was canceled.
   */
  canceled_at?: Date | null
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminCreateFulfillmentShipment {
  /**
   * The shipment's labels.
   */
  labels: AdminCreateFulfillmentLabel[]
}
