/**
 * @schema AdminUpdateOrder
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminUpdateOrder
 * properties:
 *   email:
 *     type: string
 *     title: email
 *     description: The order's email.
 *     format: email
 *   shipping_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   locale:
 *     type: string
 *     title: locale
 *     description: The order's locale.
 *   metadata:
 *     type: object
 *     description: The order's metadata.
 * 
*/

