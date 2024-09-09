/**
 * @schema AdminFulfillmentItem
 * type: object
 * description: The details of a fulfillment's item.
 * x-schemaName: AdminFulfillmentItem
 * required:
 *   - id
 *   - title
 *   - quantity
 *   - sku
 *   - barcode
 *   - line_item_id
 *   - inventory_item_id
 *   - fulfillment_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The item's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The item's title.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity to be fulfilled.
 *   sku:
 *     type: string
 *     title: sku
 *     description: The item's SKU.
 *   barcode:
 *     type: string
 *     title: barcode
 *     description: The item's barcode.
 *   line_item_id:
 *     type: string
 *     title: line_item_id
 *     description: The ID of the order's line item to be fulfilled.
 *   inventory_item_id:
 *     type: string
 *     title: inventory_item_id
 *     description: The ID of the inventory item of the underlying product variant.
 *   fulfillment_id:
 *     type: string
 *     title: fulfillment_id
 *     description: The ID of the fulfillment the item belongs to.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the item was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the item was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the item was deleted.
 * 
*/

