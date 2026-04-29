import { Attachment, NotificationContent } from "./common"

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
   * The sender of the notification. It can be email, phone number, or username, depending on the channel.
   */
  from?: string | null
  /**
   * The channel through which the notification is sent, such as `email` or `sms`.
   */
  channel: string
  /**
   * The template name in the provider's system.
   */
  template?: string | null
  /**
   * The data that gets passed over to the provider for rendering the notification.
   */
  data?: Record<string, unknown> | null
  /**
   * Additional data specific to the provider or channel. For example, cc and bcc for emails.
   */
  provider_data?: Record<string, unknown> | null
  /**
   * The content that gets passed over to the provider.
   */
  content?: NotificationContent | null
  /**
   * The event name, the workflow, or anything else that can help to identify what triggered the notification.
   */
  trigger_type?: string | null
  /**
   * The ID of the resource this notification is for, if applicable. Useful for displaying relevant information in the UI.
   * For example, the ID of the order if the notification is related to an order update.
   */
  resource_id?: string | null
  /**
   * The type of the resource this notification is for, if applicable. For example, `order` if it's related to an order update.
   */
  resource_type?: string | null
  /**
   * The ID of the customer this notification is for, if applicable.
   */
  receiver_id?: string | null
  /**
   * The original notification, in case this is a resent notification.
   */
  original_notification_id?: string | null
  /**
   * An idempotency key that ensures the same notification is not sent multiple times.
   */
  idempotency_key?: string | null
  /**
   * Optional attachments for the notification.
   */
  attachments?: Attachment[] | null
}
