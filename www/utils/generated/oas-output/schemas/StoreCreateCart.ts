/**
 * @schema StoreCreateCart
 * type: object
 * description: The details of the cart to be created.
 * x-schemaName: StoreCreateCart
 * properties:
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the cart's region. This affects the prices and currency of the cart.
 *   shipping_address:
 *     $ref: "#/components/schemas/StoreCartAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/StoreCartAddress"
 *   email:
 *     type: string
 *     title: email
 *     description: The email of the cart's customer.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The cart's currency code. If not provided, the region's currency is used. This affects prices in the cart, as well.
 *     example: usd
 *   items:
 *     type: array
 *     description: The cart's items.
 *     items:
 *       $ref: "#/components/schemas/StoreCartLineItem"
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the sales channel that cart is created in. Only products available in that sales channel can be added to the cart. If not provided, the store's default sales channel is associated with the cart instead.
 *   metadata:
 *     type: object
 *     description: The cart's metadata, can hold custom key-value pairs.
 * 
*/

