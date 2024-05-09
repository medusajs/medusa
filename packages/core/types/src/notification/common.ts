import { BaseFilterable } from "../dal"
import { OperatorMap } from "../dal/utils"

/**
 * @interface
 *
 * A notification's data.
 */
export interface NotificationDTO {
  /**
   * The ID of the notification.
   */
  id: string
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
  data: Record<string, unknown> | null
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
  /**
   * The id of the notification in the external system, if applicable
   */
  external_id?: string | null
  /**
   * The ID of the notification provider.
   */
  provider_id: string
  /**
   * Information about the notification provider
   */
  provider: NotificationProviderDTO
  /**
   * The date and time the notification was created.
   */
  created_at: Date
}

/**
 * @interface
 *
 * Information about the notification provider
 */
export interface NotificationProviderDTO {
  /**
   * The ID of the notification provider.
   */
  id: string
  /**
   * The handle of the notification provider.
   */
  handle: string
  /**
   * A user-friendly name of the notification provider.
   */
  name: string
  /**
   * The supported channels by the notification provider.
   */
  channels: string[]
}

/**
 * @interface
 *
 * The filters to apply on retrieved notifications.
 *
 * @prop q - Search through the notifications' attributes, such as trigger types and recipients, using this search term.
 */

export interface FilterableNotificationProps
  extends BaseFilterable<FilterableNotificationProps> {
  /**
   * Search through the notifications' attributes, such as trigger types and recipients, using this search term.
   */
  q?: string
  /**
   * Filter based on the recipient of the notification.
   */
  to?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter based on the channel through which the notification is sent, such as 'email' or 'sms'
   */
  channel?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter based on the template name.
   */
  template?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter based on the trigger type.
   */
  trigger_type?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter based on the resource that was the trigger for the notification.
   */
  resource_id?: string | string[] | OperatorMap<string | string[]>
  /**
   * T* Filter based on the resource type that was the trigger for the notification.
   */
  resource_type?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filter based on the customer ID.
   */
  customer_id?: string | string[] | OperatorMap<string | string[]>
  /**
   * Filters a notification based on when it was sent and created in the database
   */
  created_at?: OperatorMap<string>
}
