/**
 * @schema BasePaymentCollection
 * type: object
 * description: The payment collection's details.
 * x-schemaName: BasePaymentCollection
 * required:
 *   - id
 *   - currency_code
 *   - region_id
 *   - amount
 *   - status
 *   - payment_providers
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The payment collection's ID.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The payment collection's currency code.
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the region this payment collection is associated with.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The total amount to be paid.
 *   authorized_amount:
 *     type: number
 *     title: authorized_amount
 *     description: The total authorized amount of the collection's payments.
 *   captured_amount:
 *     type: number
 *     title: captured_amount
 *     description: The total captured amount of the collection's payments.
 *   refunded_amount:
 *     type: number
 *     title: refunded_amount
 *     description: The total refunded amount of the collection's payments.
 *   completed_at:
 *     type: string
 *     format: date-time
 *     title: completed_at
 *     description: The date the payment collection was completed.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the payment collection was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the payment collection was updated.
 *   metadata:
 *     type: object
 *     description: The payment collection's metadata, can hold custom key-value pairs.
 *   status:
 *     type: string
 *     description: The payment collection's status.
 *     enum:
 *       - canceled
 *       - not_paid
 *       - awaiting
 *       - authorized
 *       - partially_authorized
 *   payment_providers:
 *     type: array
 *     description: The payment provider used to process the collection's payments and sessions.
 *     items:
 *       $ref: "#/components/schemas/BasePaymentProvider"
 *   payment_sessions:
 *     type: array
 *     description: The payment collection's payment sessions.
 *     items:
 *       $ref: "#/components/schemas/BasePaymentSession"
 *   payments:
 *     type: array
 *     description: The payment collection's payments.
 *     items:
 *       $ref: "#/components/schemas/BasePayment"
 * 
*/

