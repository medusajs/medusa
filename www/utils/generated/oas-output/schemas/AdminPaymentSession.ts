/**
 * @schema AdminPaymentSession
 * type: object
 * description: The payment session's details.
 * x-schemaName: AdminPaymentSession
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The payment session's ID.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The payment session's amount.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The payment session's currency code.
 *     example: usd
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the payment provider processing this session.
 *   data:
 *     type: object
 *     description: The payment session's data, useful for the payment provider processing the payment.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/payment/payment-session#data-property
 *   context:
 *     type: object
 *     description: The context around the payment, such as the customer's details.
 *     example:
 *       customer:
 *         id: cus_123
 *   status:
 *     type: string
 *     description: The payment session's status.
 *     enum:
 *       - authorized
 *       - captured
 *       - canceled
 *       - pending
 *       - requires_more
 *       - error
 *   authorized_at:
 *     type: string
 *     title: authorized_at
 *     description: The date the payment session was authorized.
 *     format: date-time
 *   payment_collection:
 *     $ref: "#/components/schemas/AdminPaymentCollection"
 *   payment:
 *     $ref: "#/components/schemas/BasePayment"
 * required:
 *   - id
 *   - amount
 *   - currency_code
 *   - provider_id
 *   - data
 *   - status
 * 
*/

