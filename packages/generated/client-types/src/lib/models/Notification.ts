/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Customer } from "./Customer"
import type { NotificationProvider } from "./NotificationProvider"

/**
 * A notification is an alert sent, typically to customers, using the installed Notification Provider as a reaction to internal events such as `order.placed`. Notifications can be resent.
 */
export interface Notification {
  /**
   * The notification's ID
   */
  id: string
  /**
   * The name of the event that the notification was sent for.
   */
  event_name: string | null
  /**
   * The type of resource that the Notification refers to.
   */
  resource_type: string
  /**
   * The ID of the resource that the Notification refers to.
   */
  resource_id: string
  /**
   * The ID of the customer that this notification was sent to.
   */
  customer_id: string | null
  /**
   * The details of the customer that this notification was sent to.
   */
  customer?: Customer | null
  /**
   * The address that the Notification was sent to. This will usually be an email address, but can represent other addresses such as a chat bot user ID.
   */
  to: string
  /**
   * The data that the Notification was sent with. This contains all the data necessary for the Notification Provider to initiate a resend.
   */
  data: Record<string, any>
  /**
   * The notification's parent ID
   */
  parent_id: string | null
  /**
   * The details of the parent notification.
   */
  parent_notification?: Notification | null
  /**
   * The details of all resends of the notification.
   */
  resends?: Array<Notification>
  /**
   * The ID of the notification provider used to send the notification.
   */
  provider_id: string | null
  /**
   * The notification provider used to send the notification.
   */
  provider?: NotificationProvider | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
}
