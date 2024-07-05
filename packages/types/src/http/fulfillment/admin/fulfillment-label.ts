/**
 * @experimental
 */
export interface AdminFulfillmentLabelResponse {
  id: string
  tracking_number: string
  tracking_url: string
  label_url: string
  fulfillment_id: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
