/**
 * @schema StoreAddCartShippingMethodsBase
 * type: object
 * description: The shipping method's details.
 * x-schemaName: StoreAddCartShippingMethodsBase
 * required:
 *   - option_id
 * properties:
 *   option_id:
 *     type: string
 *     title: option_id
 *     description: The ID of the shipping option to add to the cart.
 *   data:
 *     type: object
 *     description: Any additional data relevant for the third-party fulfillment provider to process the shipment.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/storefront-development/checkout/shipping#data-request-body-parameter
 *       description: Learn more about the data parameter.
 * 
*/
