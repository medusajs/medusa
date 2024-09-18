/**
 * @schema AdminPrice
 * type: object
 * description: The price's details.
 * x-schemaName: AdminPrice
 * required:
 *   - id
 *   - title
 *   - currency_code
 *   - amount
 *   - raw_amount
 *   - min_quantity
 *   - max_quantity
 *   - price_set_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The price's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The price's title.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The price's currency code.
 *     example: usd
 *   amount:
 *     type: number
 *     title: amount
 *     description: The price's amount.
 *   raw_amount:
 *     type: object
 *     description: The price's raw amount.
 *   min_quantity:
 *     type: number
 *     title: min_quantity
 *     description: The minimum quantity that must be available in the cart for the price to be applied.
 *   max_quantity:
 *     type: number
 *     title: max_quantity
 *     description: The maximum quantity allowed to be available in the cart for the price to be applied.
 *   price_set_id:
 *     type: string
 *     title: price_set_id
 *     description: The ID of the associated price set.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the price was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the price was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the price was deleted.
 * 
*/

