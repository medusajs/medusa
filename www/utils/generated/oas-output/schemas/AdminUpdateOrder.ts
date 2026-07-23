/**
 * @schema AdminUpdateOrder
 * type: object
 * description: The details to update in the order.
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
 *   metadata:
 *     type: object
 *     description: The order's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 *   locale:
 *     type: string
 *     title: locale
 *     description: The order's locale in [BCP 47](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1) format.
 *     example: en-US
 * 
*/

