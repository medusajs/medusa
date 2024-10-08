import { PaginatedResponse } from "../../common"
import { AdminNotification } from "./entities"

export interface AdminNotificationResponse {
  notification: AdminNotification
}

export interface AdminNotificationListResponse
  extends PaginatedResponse<{
    notifications: AdminNotification[]
  }> {}
