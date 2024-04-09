/**
 * The fulfillment address to be created.
 */
export interface CreateFulfillmentAddressDTO {
  /**
   * The associated fulfillment's ID.
   */
  fulfillment_id: string

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
