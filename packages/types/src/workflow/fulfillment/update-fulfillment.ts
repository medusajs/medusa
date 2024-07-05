/**
 * The attributes to update in the fulfillment.
 */
export interface UpdateFulfillmentWorkflowInput {
  /**
   * The ID of the fulfillment
   */
  id: string

  /**
   * The associated location's ID.
   */
  location_id?: string

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
   * The data necessary for the associated fulfillment provider to process the fulfillment.
   */
  data?: Record<string, unknown> | null

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}
