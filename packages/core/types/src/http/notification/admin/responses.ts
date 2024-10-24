import { PaginatedResponse } from "../../common"
import { AdminNotification } from "./entities"

export interface AdminNotificationResponse {
  /**
   * The notification's details.
   */
  notification: AdminNotification
}

export interface AdminNotificationListResponse
  extends PaginatedResponse<{
    /**
     * The list of notifications.
     */
    notifications: AdminNotification[]
  }> {}
