/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Customer } from "./Customer"
import type { NotificationProvider } from "./NotificationProvider"

/**
 * Notifications a communications sent via Notification Providers as a reaction to internal events such as `order.placed`. Notifications can be used to show a chronological timeline for communications sent to a Customer regarding an Order, and enables resends.
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
   * The ID of the Customer that the Notification was sent to.
   */
  customer_id: string | null
  /**
   * A customer object. Available if the relation `customer` is expanded.
   */
  customer?: Customer | null
  /**
   * The address that the Notification was sent to. This will usually be an email address, but represent other addresses such as a chat bot user id
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
   * Available if the relation `parent_notification` is expanded.
   */
  parent_notification?: Notification | null
  /**
   * The resends that have been completed after the original Notification. Available if the relation `resends` is expanded.
   */
  resends?: Array<Notification>
  /**
   * The id of the Notification Provider that handles the Notification.
   */
  provider_id: string | null
  /**
   * Available if the relation `provider` is expanded.
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
