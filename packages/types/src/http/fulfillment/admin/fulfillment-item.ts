/**
 * @experimental
 */
export interface AdminFulfillmentItemResponse {
  id: string
  title: string
  quantity: number
  sku: string
  barcode: string
  line_item_id: string | null
  inventory_item_id: string | null
  fulfillment_id: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
