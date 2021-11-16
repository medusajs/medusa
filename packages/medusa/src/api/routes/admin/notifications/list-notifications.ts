import {
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator"
import _ from "lodash"
import {
  defaultAdminNotificationsFields,
  defaultAdminNotificationsRelations,
} from "./"
import { NotificationService } from "../../../../services"
import { validator } from "../../../../utils/validator"

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
  const validatedQuery = await validator(AdminGetNotificationsParams, req.query)

  const limit = validatedQuery.limit ? parseInt(validatedQuery.limit) : 50
  const offset = validatedQuery.offset ? parseInt(validatedQuery.offset) : 0

  const selector: any = {}

  let includeFields: string[] = []
  if (validatedQuery.fields) {
    includeFields = validatedQuery.fields.split(",")
  }

  let expandFields: string[] = []
  if (validatedQuery.expand) {
    expandFields = validatedQuery.expand.split(",")
  }

  if (validatedQuery.event_name) {
    const values = validatedQuery.event_name.split(",")
    selector.event_name = values.length > 1 ? values : values[0]
  }

  if (validatedQuery.resource_type) {
    const values = validatedQuery.resource_type.split(",")
    selector.resource_type = values.length > 1 ? values : values[0]
  }

  if (validatedQuery.resource_id) {
    const values = validatedQuery.resource_id.split(",")
    selector.resource_id = values.length > 1 ? values : values[0]
  }

  if (validatedQuery.to) {
    const values = validatedQuery.to.split(",")
    selector.to = values.length > 1 ? values : values[0]
  }

  if (
    !validatedQuery.include_resends ||
    validatedQuery.include_resends === "false"
  ) {
    selector.parent_id = null
  }

  const listConfig = {
    select: includeFields.length
      ? includeFields
      : defaultAdminNotificationsFields,
    relations: expandFields.length
      ? expandFields
      : defaultAdminNotificationsRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const notifications = await notificationService.list(selector, listConfig)

  const fields = [...listConfig.select, ...listConfig.relations]
  const data = notifications.map((o) => _.pick(o, fields))

  res.json({ notifications: data, offset, limit })
}

export class AdminGetNotificationsParams {
  @IsOptional()
  @IsNumberString()
  limit?: string

  @IsOptional()
  @IsNumberString()
  offset?: string

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
