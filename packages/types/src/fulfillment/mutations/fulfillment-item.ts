export interface CreateFulfillmentItemDTO {
  fulfillment_id: string
  title: string
  sku: string
  quantity: number
  barcode: string
  line_item_id?: string | null
  inventory_item_id?: string | null
}
