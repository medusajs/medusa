export interface AdminNotification {
  /**
   * The notification's ID.
   */
  id: string
  /**
   * The identifier the notification is sent to.
   * For example, an email, phone number, or username.
   */
  to: string
  /**
   * The channel to send the notification through.
   * 
   * @example
   * email
   */
  channel: string
  /**
   * A template ID to use for the notification's content.
   * 
   * For example, the ID of a template in SendGrid.
   */
  template: string
  /**
   * Data to pass to the template.
   */
  data?: Record<string, unknown> | null
  /**
   * What triggered this notification.
   * 
   * @example
   * order.created
   */
  trigger_type?: string | null
  /**
   * The ID of the associated resource. for example, if the notification was triggered 
   * because an order was created, this would be the ID of the order.
   */
  resource_id?: string | null
  /**
   * The type of the resource that triggered the notification.
   * 
   * @example
   * order
   */
  resource_type?: string | null
  /**
   * The ID of the user or customer that received the notification.
   */
  receiver_id?: string | null
  /**
   * The ID of the original notification if this is a resend of it.
   */
  original_notification_id?: string | null
  /**
   * The ID of the notification in an external or third-party system.
   */
  external_id?: string | null
  /**
   * The ID of the notification provider used.
   */
  provider_id: string
  /**
   * The date the notification was created.
   */
  created_at: string
}
