/**
 * @schema BaseClaimItem
 * type: object
 * description: The claim item's claim items.
 * x-schemaName: BaseClaimItem
 * required:
 *   - id
 *   - claim_id
 *   - order_id
 *   - item_id
 *   - quantity
 *   - reason
 *   - raw_quantity
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The claim item's ID.
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The claim item's claim id.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The claim item's order id.
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The claim item's item id.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The claim item's quantity.
 *   reason:
 *     type: string
 *     enum:
 *       - missing_item
 *       - wrong_item
 *       - production_failure
 *       - other
 *   raw_quantity:
 *     type: object
 *     description: The claim item's raw quantity.
 *   metadata:
 *     type: object
 *     description: The claim item's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The claim item's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The claim item's updated at.
 * 
*/

