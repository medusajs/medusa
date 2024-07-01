/**
 * @schema AdminOrderCreateShipment
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminOrderCreateShipment
 * required:
 *   - items
 *   - metadata
 * properties:
 *   items:
 *     type: array
 *     description: The order's items.
 *     items:
 *       type: object
 *       description: The item's items.
 *       required:
 *         - id
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The item's ID.
 *         quantity:
 *           type: number
 *           title: quantity
 *           description: The item's quantity.
 *   labels:
 *     type: array
 *     description: The order's labels.
 *     items:
 *       type: object
 *       description: The label's labels.
 *       required:
 *         - tracking_number
 *         - tracking_url
 *         - label_url
 *       properties:
 *         tracking_number:
 *           type: string
 *           title: tracking_number
 *           description: The label's tracking number.
 *         tracking_url:
 *           type: string
 *           title: tracking_url
 *           description: The label's tracking url.
 *         label_url:
 *           type: string
 *           title: label_url
 *           description: The label's label url.
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: The order's no notification.
 *   metadata:
 *     type: object
 *     description: The order's metadata.
 * 
*/

