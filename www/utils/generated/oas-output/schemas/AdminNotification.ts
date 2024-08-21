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
 *     description: The notification's to.
 *   channel:
 *     type: string
 *     title: channel
 *     description: The notification's channel.
 *   template:
 *     type: string
 *     title: template
 *     description: The notification's template.
 *   data:
 *     type: object
 *     description: The notification's data.
 *   trigger_type:
 *     type: string
 *     title: trigger_type
 *     description: The notification's trigger type.
 *   resource_id:
 *     type: string
 *     title: resource_id
 *     description: The notification's resource id.
 *   resource_type:
 *     type: string
 *     title: resource_type
 *     description: The notification's resource type.
 *   receiver_id:
 *     type: string
 *     title: receiver_id
 *     description: The notification's receiver id.
 *   original_notification_id:
 *     type: string
 *     title: original_notification_id
 *     description: The notification's original notification id.
 *   external_id:
 *     type: string
 *     title: external_id
 *     description: The notification's external id.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The notification's provider id.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The notification's created at.
 * 
*/

