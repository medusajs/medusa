/**
 * The type of fulfillment's location.
 */
export type GeoZoneType = "country" | "province" | "city" | "zip"

/**
 * The fulfillment details.
 */
export interface FulfillmentDTO {
  /**
   * The ID of the fulfillment.
   */
  id: string

  /**
   * The name of the fulfillment.
   */
  name: string
}
