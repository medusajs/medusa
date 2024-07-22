import { BaseFilterable } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminNotificationListParams
  extends BaseFilterable<AdminNotificationListParams>,
    FindParams {
  q?: string
  id?: string | string[]
  channel?: string | string[]
}

export interface AdminNotificationParams extends SelectParams {}
