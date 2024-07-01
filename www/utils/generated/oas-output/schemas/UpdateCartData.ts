/**
 * @schema UpdateCartData
 * type: object
 * description: SUMMARY
 * x-schemaName: UpdateCartData
 * properties:
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The cart's region id.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The cart's customer id.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The cart's sales channel id.
 *   email:
 *     type: string
 *     title: email
 *     description: The cart's email.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The cart's currency code.
 *   shipping_address_id:
 *     type: string
 *     title: shipping_address_id
 *     description: The cart's shipping address id.
 *   billing_address_id:
 *     type: string
 *     title: billing_address_id
 *     description: The cart's billing address id.
 *   billing_address:
 *     oneOf:
 *       - $ref: "#/components/schemas/CreateAddress"
 *       - $ref: "#/components/schemas/UpdateAddress"
 *   shipping_address:
 *     oneOf:
 *       - $ref: "#/components/schemas/CreateAddress"
 *       - $ref: "#/components/schemas/UpdateAddress"
 *   metadata:
 *     type: object
 *     description: The cart's metadata.
 * 
*/

