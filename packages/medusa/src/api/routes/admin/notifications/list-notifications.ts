import { IsBooleanString, IsInt, IsOptional, IsString } from "class-validator"
import {
  defaultAdminNotificationsFields,
  defaultAdminNotificationsRelations,
} from "./"

import { FindConfig } from "../../../../types/common"
import { Notification } from "../../../../models"
import { NotificationService } from "../../../../services"
import { Type } from "class-transformer"
import { pick } from "lodash"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /admin/notifications
 * operationId: "GetNotifications"
 * summary: "List Notifications"
 * description: "Retrieve a list of notifications. The notifications can be filtered by fields such as `event_name` or `resource_type`. The notifications can also be paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {integer} The number of inventory items to skip when retrieving the inventory items.
 *   - (query) limit=50 {integer} Limit the number of notifications returned.
 *   - (query) fields {string} Comma-separated fields that should be included in each returned notification.
 *   - (query) expand {string} Comma-separated relations that should be expanded in each returned notification.
 *   - (query) event_name {string} Filter by the name of the event that triggered sending this notification.
 *   - (query) resource_type {string} Filter by the resource type.
 *   - (query) resource_id {string} Filter by the resource ID.
 *   - (query) to {string} Filter by the address that the Notification was sent to. This will usually be an email address, but it can also represent other addresses such as a chat bot user id.
 *   - (query) include_resends {string} A boolean indicating whether the result set should include resent notifications or not
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetNotificationsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.notifications.list()
 *       .then(({ notifications }) => {
 *         console.log(notifications.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/notifications' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Notifications
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminNotificationsListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
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

  const [notifications, count] = await notificationService.listAndCount(
    selector,
    listConfig
  )

  const resultFields = [
    ...(listConfig.select ?? []),
    ...(listConfig.relations ?? []),
  ]
  const data = notifications.map((o) => pick(o, resultFields))

  res.json({ notifications: data, count, limit, offset })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved notifications.
 */
export class AdminGetNotificationsParams {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 50
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 50

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  /**
   * {@inheritDoc FindParams.fields}
   */
  @IsOptional()
  @IsString()
  fields?: string

  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsOptional()
  @IsString()
  expand?: string

  /**
   * Event name to filter notifications by.
   */
  @IsOptional()
  @IsString()
  event_name?: string

  /**
   * Resource type to filter notifications by.
   */
  @IsOptional()
  @IsString()
  resource_type?: string

  /**
   * Resource ID to filter notifications by.
   */
  @IsOptional()
  @IsString()
  resource_id?: string

  /**
   * Filter notifications by their `to` field.
   */
  @IsOptional()
  @IsString()
  to?: string

  /**
   * Whether to include resends in the results.
   */
  @IsOptional()
  @IsBooleanString()
  include_resends?: string
}
