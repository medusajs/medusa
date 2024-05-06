/**
 * @schema CreateCartWorkflowInput
 * type: object
 * description: SUMMARY
 * x-schemaName: CreateCartWorkflowInput
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
 *   shipping_address:
 *     oneOf:
 *       - type: string
 *         title: shipping_address
 *         description: The cart's shipping address.
 *       - $ref: "#/components/schemas/CreateCartAddress"
 *   billing_address:
 *     oneOf:
 *       - type: string
 *         title: billing_address
 *         description: The cart's billing address.
 *       - $ref: "#/components/schemas/CreateCartAddress"
 *   metadata:
 *     type: object
 *     description: The cart's metadata.
 *     properties: {}
 *   items:
 *     type: array
 *     description: The cart's items.
 *     items:
 *       $ref: "#/components/schemas/CreateCartCreateLineItem"
 *   promo_codes:
 *     type: array
 *     description: The cart's promo codes.
 *     items:
 *       type: string
 *       title: promo_codes
 *       description: The promo code's promo codes.
 * 
*/

