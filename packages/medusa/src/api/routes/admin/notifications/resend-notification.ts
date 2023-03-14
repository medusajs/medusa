import {
  defaultAdminNotificationsFields,
  defaultAdminNotificationsRelations,
} from "."

import { EntityManager } from "typeorm"
import { IsOptional, IsString } from "class-validator"
import { Notification } from "../../../../models"
import { NotificationService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /notifications/{id}/resend
 * operationId: "PostNotificationsNotificationResend"
 * summary: "Resend Notification"
 * description: "Resends a previously sent notifications, with the same data but optionally to a different address"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Notification
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostNotificationsNotificationResendReq"
 * x-codegen:
 *   method: resend
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.notifications.resend(notification_id)
 *       .then(({ notification }) => {
 *         console.log(notification.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/notifications/{id}/resend' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Notification
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminNotificationsRes"
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
  const { id } = req.params

  const validatedBody = await validator(
    AdminPostNotificationsNotificationResendReq,
    req.body
  )

  const notificationService: NotificationService = req.scope.resolve(
    "notificationService"
  )

  const config: Record<string, unknown> = {}

  if (validatedBody.to) {
    config.to = validatedBody.to
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await notificationService
      .withTransaction(transactionManager)
      .resend(id, config)
  })

  const notification = await notificationService.retrieve(id, {
    select: defaultAdminNotificationsFields as (keyof Notification)[],
    relations: defaultAdminNotificationsRelations,
  })

  res.json({ notification })
}

/**
 * @schema AdminPostNotificationsNotificationResendReq
 * type: object
 * properties:
 *   to:
 *     description: "A new address or user identifier that the Notification should be sent to"
 *     type: string
 */
export class AdminPostNotificationsNotificationResendReq {
  @IsOptional()
  @IsString()
  to?: string
}
