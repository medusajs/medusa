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
 *     description: |
 *       The ID of the associated sales channel.
 *
 *       A product's availability in a sales channel only filters the products you retrieve. Medusa doesn't reject a variant added to the cart when its product isn't available in the cart's sales channel. Refer to the guide in the external documentation to learn how to enforce that validation.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/commerce-modules/cart/sales-channel-availability
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
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/store#manage-metadata
 *       description: Learn how to manage metadata
 * 
*/

