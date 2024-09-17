/**
 * @schema AdminPostOrderExchangesReqSchema
 * type: object
 * description: The exchange's details.
 * x-schemaName: AdminPostOrderExchangesReqSchema
 * required:
 *   - order_id
 * properties:
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order this exchange is created for.
 *   description:
 *     type: string
 *     title: description
 *     description: The exchange's description.
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note viewed only by admin users.
 *   metadata:
 *     type: object
 *     description: The exchange's metadata, can hold custom key-value pairs.
 * 
*/

