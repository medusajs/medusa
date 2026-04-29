/**
 * @schema AdminUpdateDraftOrder
 * type: object
 * description: The data to update in the draft order.
 * x-schemaName: AdminUpdateDraftOrder
 * properties:
 *   email:
 *     type: string
 *     title: email
 *     description: The customer email associated with the draft order.
 *     format: email
 *   shipping_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   metadata:
 *     type: object
 *     description: The draft order's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer associated with the draft order.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the sales channel associated with the draft order.
 *   locale:
 *     type: string
 *     title: locale
 *     description: The draft order's locale.
 * 
*/

