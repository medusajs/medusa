/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NotificationProvider } from './NotificationProvider';
import type { NotificationResend } from './NotificationResend';

/**
 * Notifications a communications sent via Notification Providers as a reaction to internal events such as `order.placed`. Notifications can be used to show a chronological timeline for communications sent to a Customer regarding an Order, and enables resends.
 */
export type Notification = {
  /**
   * The notification's ID
   */
  id?: string;
  /**
   * The name of the event that the notification was sent for.
   */
  event_name?: string;
  /**
   * The type of resource that the Notification refers to.
   */
  resource_type: string;
  /**
   * The ID of the resource that the Notification refers to.
   */
  resource_id: string;
  /**
   * The ID of the Customer that the Notification was sent to.
   */
  customer_id?: string;
  /**
   * A customer object. Available if the relation `customer` is expanded.
   */
  customer?: Record<string, any>;
  /**
   * The address that the Notification was sent to. This will usually be an email address, but represent other addresses such as a chat bot user id
   */
  to: string;
  /**
   * The data that the Notification was sent with. This contains all the data necessary for the Notification Provider to initiate a resend.
   */
  data?: Record<string, any>;
  /**
   * The resends that have been completed after the original Notification.
   */
  resends?: Array<NotificationResend>;
  /**
   * The id of the Notification Provider that handles the Notification.
   */
  provider_id?: string;
  /**
   * Available if the relation `provider` is expanded.
   */
  provider?: NotificationProvider;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at?: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string;
};

