/**
 * The fulfillment address details.
 */
export interface FulfillmentAddressDTO {
  /**
   * The ID of the address.
   */
  id: string

  /**
   * The associated fulfillment's ID.
   */
  fulfillment_id: string | null

  /**
   * The company of the address.
   */
  company: string | null

  /**
   * The first name of the address.
   */
  first_name: string | null

  /**
   * The last name of the address.
   */
  last_name: string | null

  /**
   * The first line of the address.
   */
  address_1: string | null

  /**
   * The second line of the address.
   */
  address_2: string | null

  /**
   * The city of the address.
   */
  city: string | null

  /**
   * The ISO 2 character country code of the address.
   */
  country_code: string | null

  /**
   * The province of the address.
   */
  province: string | null

  /**
   * The postal code of the address.
   */
  postal_code: string | null

  /**
   * The phone of the address.
   */
  phone: string | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The creation date of the address.
   */
  created_at: Date

  /**
   * The update date of the address.
   */
  updated_at: Date

  /**
   * The deletion date of the address.
   */
  deleted_at: Date | null
}
