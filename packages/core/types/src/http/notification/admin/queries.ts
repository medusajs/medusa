import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminNotificationListParams
  extends BaseFilterable<AdminNotificationListParams>,
    FindParams {
  /**
   * Query or keywords to search the notification's searchable fields.
   */
  q?: string
  /**
   * Filter by notification ID(s).
   */
  id?: string | string[]
  /**
   * Filter by channel(s).
   */
  channel?: string | string[]
  /**
   * Filter by notification to property. This can be a user id or email for example.
   */
  to?: string | string[]
}

export interface AdminNotificationParams extends SelectParams {}
