/**
 * @schema AdminPostReturnsReqSchema
 * type: object
 * description: The return's details.
 * x-schemaName: AdminPostReturnsReqSchema
 * required:
 *   - order_id
 * properties:
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order the return belongs to.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the location the items are returned to.
 *   description:
 *     type: string
 *     title: description
 *     description: The return's description.
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note viewed only by admin users.
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: Whether to send the customer a notification about the created return.
 *   metadata:
 *     type: object
 *     description: The return's metadata, can hold custom key-value pairs.
 * 
*/

