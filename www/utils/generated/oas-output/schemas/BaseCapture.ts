/**
 * @schema BaseCapture
 * type: object
 * description: The details of a captured payment.
 * x-schemaName: BaseCapture
 * required:
 *   - id
 *   - amount
 *   - created_at
 *   - payment
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The payment capture's ID.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The captured amount.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the capture was created.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The ID of the user that captured the payment.
 *   payment:
 *     $ref: "#/components/schemas/BasePayment"
 * 
*/

