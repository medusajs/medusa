/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Notification } from "./Notification"

export interface AdminNotificationsListRes {
  /**
   * an array of notifications
   */
  notifications: Array<SetRelation<Notification, "resends">>
  /**
   * The total number of notifications
   */
  count?: number
  /**
   * The number of notifications skipped when retrieving the notifications.
   */
  offset?: number
  /**
   * The number of notifications per page
   */
  limit?: number
}
