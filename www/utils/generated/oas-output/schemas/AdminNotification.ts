/**
 * @schema AdminNotification
 * type: object
 * description: The notification's details.
 * x-schemaName: AdminNotification
 * required:
 *   - id
 *   - to
 *   - channel
 *   - template
 *   - provider_id
 *   - created_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The notification's ID.
 *   to:
 *     type: string
 *     title: to
 *     description: Where to send the notification to. For example, if `channel` is `email`, this can be an email number.
 *   channel:
 *     type: string
 *     title: channel
 *     description: Through which channel is the notification sent through.
 *     example: email
 *   template:
 *     type: string
 *     title: template
 *     description: The ID of the template in a third-party service used as the notification's shape.
 *   data:
 *     type: object
 *     description: Data payload to send with the notification.
 *   trigger_type:
 *     type: string
 *     title: trigger_type
 *     description: What triggered this notification.
 *     example: order.created
 *   resource_id:
 *     type: string
 *     title: resource_id
 *     description: The ID of the associated resource. For example, if the notification was triggered because an order was created, this would be the ID of the order.
 *   resource_type:
 *     type: string
 *     title: resource_type
 *     description: The type of the resource that triggered the notification.
 *     example: order
 *   receiver_id:
 *     type: string
 *     title: receiver_id
 *     description: The ID of the user or customer that's receiving this notification.
 *   original_notification_id:
 *     type: string
 *     title: original_notification_id
 *     description: The ID of the original notification, if this notification is resent.
 *   external_id:
 *     type: string
 *     title: external_id
 *     description: The ID of the notification in an external or third-party system.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the provider used to send the notification.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the notification was created.
 * 
*/

