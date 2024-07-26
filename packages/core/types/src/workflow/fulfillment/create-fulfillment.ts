/**
 * The fulfillment address to be created.
 */
export type CreateFulfillmentAddressWorkflowDTO = {
  /**
   * The company of the fulfillment address.
   */
  company?: string | null

  /**
   * The first name of the fulfillment address.
   */
  first_name?: string | null

  /**
   * The last name of the fulfillment address.
   */
  last_name?: string | null

  /**
   * The first line of the fulfillment address.
   */
  address_1?: string | null

  /**
   * The second line of the fulfillment address.
   */
  address_2?: string | null

  /**
   * The city of the fulfillment address.
   */
  city?: string | null

  /**
   * The ISO 2 character country code of the fulfillment address.
   */
  country_code?: string | null

  /**
   * The province of the fulfillment address.
   */
  province?: string | null

  /**
   * The postal code of the fulfillment address.
   */
  postal_code?: string | null

  /**
   * The phone of the fulfillment address.
   */
  phone?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The fulfillment item to be created.
 */
export type CreateFulfillmentItemWorkflowDTO = {
  /**
   * The title of the fulfillment item.
   */
  title: string

  /**
   * The SKU of the fulfillment item.
   */
  sku: string

  /**
   * The quantity of the fulfillment item.
   */
  quantity: number

  /**
   * The barcode of the fulfillment item.
   */
  barcode: string

  /**
   * The associated line item's ID.
   */
  line_item_id?: string | null

  /**
   * The associated inventory item's ID.
   */
  inventory_item_id?: string | null
}

/**
 * The fulfillment label to be created.
 */
export type CreateFulfillmentLabelWorkflowDTO = {
  /**
   * The tracking number of the fulfillment label.
   */
  tracking_number: string

  /**
   * The tracking URL of the fulfillment label.
   */
  tracking_url: string

  /**
   * The URL of the label.
   */
  label_url: string
}

export type CreateFulfillmentOrderWorkflowDTO = Record<string, any>

export type CreateFulfillmentWorkflowInput = {
  /**
   * The associated location's ID.
   */
  location_id: string

  /**
   * The date the fulfillment was packed.
   */
  packed_at?: Date | null

  /**
   * The date the fulfillment was shipped.
   */
  shipped_at?: Date | null

  /**
   * The date the fulfillment was delivered.
   */
  delivered_at?: Date | null

  /**
   * The date the fulfillment was canceled.
   */
  canceled_at?: Date | null

  /**
   * The data necessary for the associated fulfillment provider to process the fulfillment.
   */
  data?: Record<string, unknown> | null

  /**
   * The associated fulfillment provider's ID.
   */
  provider_id: string

  /**
   * The associated shipping option's ID.
   */
  shipping_option_id?: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null

  /**
   * The address associated with the fulfillment. It's used for delivery.
   */
  delivery_address: CreateFulfillmentAddressWorkflowDTO

  /**
   * The items associated with the fulfillment.
   */
  items: CreateFulfillmentItemWorkflowDTO[]

  /**
   * The labels associated with the fulfillment.
   */
  labels?: CreateFulfillmentLabelWorkflowDTO[]

  /**
   * The associated fulfillment order to be sent to the provider.
   */
  order?: CreateFulfillmentOrderWorkflowDTO
}
