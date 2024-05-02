/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetNotificationsParams {
  /**
   * The number of inventory items to skip when retrieving the inventory items.
   */
  offset?: number
  /**
   * Limit the number of notifications returned.
   */
  limit?: number
  /**
   * Comma-separated fields that should be included in each returned notification.
   */
  fields?: string
  /**
   * Comma-separated relations that should be expanded in each returned notification.
   */
  expand?: string
  /**
   * Filter by the name of the event that triggered sending this notification.
   */
  event_name?: string
  /**
   * Filter by the resource type.
   */
  resource_type?: string
  /**
   * Filter by the resource ID.
   */
  resource_id?: string
  /**
   * Filter by the address that the Notification was sent to. This will usually be an email address, but it can also represent other addresses such as a chat bot user id.
   */
  to?: string
  /**
   * A boolean indicating whether the result set should include resent notifications or not
   */
  include_resends?: string
}
