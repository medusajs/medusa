/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminGetNotificationsParams {
  /**
   * The number of notifications to skip before starting to collect the notifications set
   */
  offset?: number
  /**
   * The number of notifications to return
   */
  limit?: number
  /**
   * Comma separated fields to include in the result set
   */
  fields?: string
  /**
   * Comma separated fields to populate
   */
  expand?: string
  /**
   * The name of the event that the notification was sent for.
   */
  event_name?: string
  /**
   * The type of resource that the Notification refers to.
   */
  resource_type?: string
  /**
   * The ID of the resource that the Notification refers to.
   */
  resource_id?: string
  /**
   * The address that the Notification was sent to. This will usually be an email address, but represent other addresses such as a chat bot user id
   */
  to?: string
  /**
   * A boolean indicating whether the result set should include resent notifications or not
   */
  include_resends?: string
}
