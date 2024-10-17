import { Attachment, NotificationContent } from "./common"

/**
 * @interface
 *
 * The details of the notification to send.
 */
export type ProviderSendNotificationDTO = {
  /**
   * The recipient of the notification. It can be email, phone number, or username, depending on the channel.
   */
  to: string
  /**
   * The sender of the notification. It can be email, phone number, or username, depending on the channel.
   */
  from?: string | null
  /**
   * Optional attachments for the notification.
   */
  attachments?: Attachment[] | null
  /**
   * The channel through which the notification is sent, such as 'email' or 'sms'
   */
  channel: string
  /**
   * The template name in the provider's system.
   */
  template?: string
  /**
   * The data that gets passed over to the provider for rendering the notification.
   */
  data?: Record<string, unknown> | null
  /**
   * The content that gets passed to the provider.
   */
  content?: NotificationContent | null
}

/**
 * @interface
 *
 * The result of sending the notification
 */
export type ProviderSendNotificationResultsDTO = {
  /**
   * The ID of the notification in the external system, if provided in the response
   */
  id?: string
}

export interface INotificationProvider {
  /**
   * This method is used to send a notification.
   *
   * @param {ProviderSendNotificationDTO} notification - All information needed to send a notification.
   * @returns {Promise<ProviderSendNotificationResultsDTO>} The result of sending the notification.
   *
   */
  send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO>
}
