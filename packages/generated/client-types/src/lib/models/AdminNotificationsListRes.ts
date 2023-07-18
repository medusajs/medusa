/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Notification } from "./Notification"

export interface AdminNotificationsListRes {
  notifications: Array<SetRelation<Notification, "resends">>
  /**
   * The total number of notifications
   */
  count?: number
  /**
   * The number of notifications skipped before these notifications
   */
  offset?: number
  /**
   * The number of notifications per page
   */
  limit?: number
}
