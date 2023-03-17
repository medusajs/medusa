/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Notification } from "./Notification"

export interface AdminNotificationsRes {
  notification: SetRelation<Notification, "resends">
}
