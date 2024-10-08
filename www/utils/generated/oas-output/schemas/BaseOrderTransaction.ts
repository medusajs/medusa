/**
 * @schema BaseOrderTransaction
 * type: object
 * description: An order transaction's details.
 * x-schemaName: BaseOrderTransaction
 * required:
 *   - id
 *   - order_id
 *   - amount
 *   - currency_code
 *   - reference
 *   - reference_id
 *   - metadata
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The transaction's ID.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order this transaction belongs to.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The transaction's amount.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The transaction's currency code.
 *     example: usd
 *   reference:
 *     type: string
 *     title: reference
 *     description: The name of a table that this transaction references. If this transaction is for captured payment, its value is `capture`. If this transaction is for refunded payment, its value is `refund`.
 *     enum:
 *       - capture
 *       - refund
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The ID of the referenced record in the referenced table.
 *   metadata:
 *     type: object
 *     description: The transaction's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date that the transaction was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date that the transaction was updated.
 * 
*/

