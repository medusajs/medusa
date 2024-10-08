/**
 * @schema AdminNotificationListResponse
 * type: object
 * description: The paginated list of notifications.
 * x-schemaName: AdminNotificationListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - notifications
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items returned.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the returned items.
 *   count:
 *     type: number
 *     title: count
 *     description: The total count of items.
 *   notifications:
 *     type: array
 *     description: The list of notifications.
 *     items:
 *       $ref: "#/components/schemas/AdminNotification"
 * 
*/

