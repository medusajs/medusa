import { FulfillmentDTO } from "./fulfillment"

/**
 * The fulfillment label details.
 */
export interface FulfillmentLabelDTO {
  /**
   * The ID of the fulfillment label.
   */
  id: string

  /**
   * The tracking number of the fulfillment label.
   */
  tracking_number: string

  /**
   * The tracking URL of the fulfillment label.
   */
  tracking_url: string

  /**
   * The label's URL.
   */
  label_url: string

  /**
   * The associated fulfillment's ID.
   */
  fulfillment_id: string

  /**
   * The associated fulfillment.
   */
  fulfillment: FulfillmentDTO

  /**
   * The creation date of the fulfillment label.
   */
  created_at: Date

  /**
   * The update date of the fulfillment label.
   */
  updated_at: Date

  /**
   * The deletion date of the fulfillment label.
   */
  deleted_at: Date | null
}
