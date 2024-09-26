/**
 * @schema StorePaymentCollection
 * type: object
 * description: The payment collection's details.
 * x-schemaName: StorePaymentCollection
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
 *     example: usd
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the associated region.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The payment collection's amount.
 *   authorized_amount:
 *     type: number
 *     title: authorized_amount
 *     description: The payment collection's authorized amount.
 *   captured_amount:
 *     type: number
 *     title: captured_amount
 *     description: The payment collection's captured amount.
 *   refunded_amount:
 *     type: number
 *     title: refunded_amount
 *     description: The payment collection's refunded amount.
 *   completed_at:
 *     type: string
 *     title: completed_at
 *     description: The date the payment collection was completed.
 *     format: date-time
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
 *     description: The payment collection's payment providers.
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

