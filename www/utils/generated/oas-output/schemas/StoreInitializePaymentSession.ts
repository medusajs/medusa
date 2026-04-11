/**
 * @schema StoreInitializePaymentSession
 * type: object
 * description: The payment session's details.
 * required:
 *   - provider_id
 * properties:
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the payment provider the customer chose.
 *     example: pp_stripe_stripe
 *   data:
 *     type: object
 *     description: Any data necessary for the payment provider to process the payment.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/commerce-modules/payment/payment-session#data-property
 *       description: Learn more about the payment session's data property
 * x-schemaName: StoreInitializePaymentSession
 * 
*/

