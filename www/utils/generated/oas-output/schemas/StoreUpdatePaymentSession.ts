/**
 * @schema StoreUpdatePaymentSession
 * type: object
 * description: The client data to merge into the payment session.
 * x-schemaName: StoreUpdatePaymentSession
 * required:
 *   - client_data
 * properties:
 *   client_data:
 *     type: object
 *     description: |-
 *       Data to merge into the session's `data.client`, such as payment details
 *       collected by the provider's checkout component. Set a property to `null` to remove it.
 * 
*/

