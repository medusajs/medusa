/**
 * @schema StoreCreateCart
 * type: object
 * description: SUMMARY
 * x-schemaName: StoreCreateCart
 * properties:
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The cart's region id.
 *   shipping_address:
 *     $ref: "#/components/schemas/StoreCartAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/StoreCartAddress"
 *   email:
 *     type: string
 *     title: email
 *     description: The cart's email.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The cart's currency code.
 *   items:
 *     type: array
 *     description: The cart's items.
 *     items:
 *       $ref: "#/components/schemas/StoreCartLineItem"
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The cart's sales channel id.
 *   metadata:
 *     type: object
 *     description: The cart's metadata.
 * 
*/

