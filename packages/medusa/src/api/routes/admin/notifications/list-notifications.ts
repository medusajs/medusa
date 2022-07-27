import { Type } from "class-transformer"
import { IsBooleanString, IsInt, IsOptional, IsString } from "class-validator"
import { pick } from "lodash"
import { NotificationService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import {
  defaultAdminNotificationsFields,
  defaultAdminNotificationsRelations,
} from "./"
import { Notification } from "../../../../models"
import { FindConfig } from "../../../../types/common"

/**
 * @oas [get] /notifications
 * operationId: "GetNotifications"
 * summary: "List Notifications"
 * description: "Retrieves a list of Notifications."
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {integer} The number of notifications to skip before starting to collect the notifications set
 *   - (query) limit=50 {integer} The number of notifications to return
 *   - (query) fields {string} The fields to include in the result set
 *   - (query) expand {string} The fields to populate
 *   - (query) event_name {string}
 *   - (query) resource_type {string}
 *   - (query) resource_id {string}
 *   - (query) to {string}
 *   - (query) include_resends {boolean} Whether the result set should include resent notifications or not
 * tags:
 *   - Notification
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             notifications:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/notification"
 */
export default async (req, res) => {
  const notificationService: NotificationService = req.scope.resolve(
    "notificationService"
  )
  const {
    limit,
    offset,
    fields,
    expand,
    event_name,
    resource_id,
    resource_type,
    to,
    include_resends,
  } = await validator(AdminGetNotificationsParams, req.query)

  const selector: Record<string, unknown> = {}

  let includeFields: string[] = []
  if (fields) {
    includeFields = fields.split(",")
  }

  let expandFields: string[] = []
  if (expand) {
    expandFields = expand.split(",")
  }

  if (event_name) {
    const values = event_name.split(",")
    selector.event_name = values.length > 1 ? values : values[0]
  }

  if (resource_type) {
    const values = resource_type.split(",")
    selector.resource_type = values.length > 1 ? values : values[0]
  }

  if (resource_id) {
    const values = resource_id.split(",")
    selector.resource_id = values.length > 1 ? values : values[0]
  }

  if (to) {
    const values = to.split(",")
    selector.to = values.length > 1 ? values : values[0]
  }

  if (!include_resends || include_resends === "false") {
    selector.parent_id = null
  }

  const listConfig = {
    select: (includeFields.length
      ? includeFields
      : defaultAdminNotificationsFields) as (keyof Notification)[],
    relations: expandFields.length
      ? expandFields
      : defaultAdminNotificationsRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  } as FindConfig<Notification>

  const notifications = await notificationService.list(selector, listConfig)

  const resultFields = [
    ...(listConfig.select ?? []),
    ...(listConfig.relations ?? []),
  ]
  const data = notifications.map((o) => pick(o, resultFields))

  res.json({ notifications: data })
}

export class AdminGetNotificationsParams {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 50

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @IsString()
  fields?: string

  @IsOptional()
  @IsString()
  expand?: string

  @IsOptional()
  @IsString()
  event_name?: string

  @IsOptional()
  @IsString()
  resource_type?: string

  @IsOptional()
  @IsString()
  resource_id?: string

  @IsOptional()
  @IsString()
  to?: string

  @IsOptional()
  @IsBooleanString()
  include_resends?: string
}
