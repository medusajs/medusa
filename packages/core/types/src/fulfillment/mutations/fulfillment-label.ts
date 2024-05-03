/**
 * The fulfillment label to be created.
 */
export interface CreateFulfillmentLabelDTO {
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

  /**
   * The associated fulfillment's ID.
   */
  fulfillment_id: string
}
