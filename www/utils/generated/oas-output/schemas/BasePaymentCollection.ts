/**
 * @schema BasePaymentCollection
 * type: object
 * description: The payment collection's payment collections.
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
 *     description: The payment collection's region id.
 *   amount:
 *     oneOf:
 *       - type: string
 *         title: amount
 *         description: The payment collection's amount.
 *       - type: number
 *         title: amount
 *         description: The payment collection's amount.
 *       - type: string
 *         title: amount
 *         description: The payment collection's amount.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   authorized_amount:
 *     oneOf:
 *       - type: string
 *         title: authorized_amount
 *         description: The payment collection's authorized amount.
 *       - type: number
 *         title: authorized_amount
 *         description: The payment collection's authorized amount.
 *       - type: string
 *         title: authorized_amount
 *         description: The payment collection's authorized amount.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   captured_amount:
 *     oneOf:
 *       - type: string
 *         title: captured_amount
 *         description: The payment collection's captured amount.
 *       - type: number
 *         title: captured_amount
 *         description: The payment collection's captured amount.
 *       - type: string
 *         title: captured_amount
 *         description: The payment collection's captured amount.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   refunded_amount:
 *     oneOf:
 *       - type: string
 *         title: refunded_amount
 *         description: The payment collection's refunded amount.
 *       - type: number
 *         title: refunded_amount
 *         description: The payment collection's refunded amount.
 *       - type: string
 *         title: refunded_amount
 *         description: The payment collection's refunded amount.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   completed_at:
 *     oneOf:
 *       - type: string
 *         title: completed_at
 *         description: The payment collection's completed at.
 *       - type: string
 *         title: completed_at
 *         description: The payment collection's completed at.
 *         format: date-time
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The payment collection's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The payment collection's updated at.
 *   metadata:
 *     type: object
 *     description: The payment collection's metadata.
 *   status:
 *     type: string
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

