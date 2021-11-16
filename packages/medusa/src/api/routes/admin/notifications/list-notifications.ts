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
 *   - in: query
 *     name: offset
 *     schema:
 *       type: integer
 *     description: The number of notifications to skip before starting to collect the notifications set
 *   - in: query
 *     name: limit
 *     schema:
 *       type: integer
 *     description: The number of notifications to return
 *   - in: query
 *     name: fields
 *     schema:
 *       type: string
 *     description: The fields to include in the result set
 *   - in: query
 *     name: expand
 *     schema:
 *       type: string
 *     description: The fields to populate
 *   - in: query
 *     name: event_name
 *     schema:
 *       type: string
 *   - in: query
 *     name: resource_type
 *     schema:
 *       type: string
 *   - in: query
 *     name: resource_id
 *     schema:
 *       type: string
 *   - in: query
 *     name: to
 *     schema:
 *       type: string
 *   - in: query
 *     name: include_resends
 *     schema:
 *       type: boolean
 *     description: Whether the result set should include resends or not
 *
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
  const validatedQuery = await validator(AdminGetNotificationsQuery, req.query)

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

export class AdminGetNotificationsQuery {
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
