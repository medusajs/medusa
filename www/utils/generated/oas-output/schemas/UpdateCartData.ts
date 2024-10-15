/**
 * @schema UpdateCartData
 * type: object
 * description: The details to update in a cart.
 * x-schemaName: UpdateCartData
 * properties:
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the associated region. This can affect the prices and currency code of the cart.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer that the cart belongs to.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the associated sales channel. Only products available in this channel can be added to the cart.
 *   email:
 *     type: string
 *     title: email
 *     description: The email of the customer that the cart belongs to.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The cart's currency code.
 *     example: usd
 *   shipping_address_id:
 *     type: string
 *     title: shipping_address_id
 *     description: The ID of the cart's shipping address.
 *   billing_address_id:
 *     type: string
 *     title: billing_address_id
 *     description: The ID of the cart's billing address.
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
 *     description: The cart's metadata, ca hold custom key-value pairs.
 * 
*/

