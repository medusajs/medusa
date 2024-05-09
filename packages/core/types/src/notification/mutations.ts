/**
 * @interface
 *
 * A notification to send and have created in the DB
 *
 */
export interface CreateNotificationDTO {
  /**
   * The recipient of the notification. It can be email, phone number, or username, depending on the channel.
   */
  to: string
  /**
   * The channel through which the notification is sent, such as 'email' or 'sms'
   */
  channel: string
  /**
   * The template name in the provider's system.
   */
  template: string
  /**
   * The data that gets passed over to the provider for rendering the notification.
   */
  data?: Record<string, unknown> | null
  /**
   * The event name, the workflow, or anything else that can help to identify what triggered the notification.
   */
  trigger_type?: string | null
  /**
   * The ID of the resource this notification is for, if applicable. Useful for displaying relevant information in the UI
   */
  resource_id?: string | null
  /**
   * The type of the resource this notification is for, if applicable, eg. "order"
   */
  resource_type?: string | null
  /**
   * The ID of the customer this notification is for, if applicable.
   */
  customer_id?: string | null
  /**
   * The original notification, in case this is a retried notification.
   */
  original_notification_id?: string | null
}
