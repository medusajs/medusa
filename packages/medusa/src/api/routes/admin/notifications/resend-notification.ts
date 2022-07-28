import { IsString } from "class-validator"
import { IsOptional } from "class-validator"
import {
  defaultAdminNotificationsFields,
  defaultAdminNotificationsRelations,
} from "."
import { validator } from "../../../../utils/validator"
import { NotificationService } from "../../../../services"
import { Notification } from "../../../../models"

/**
 * @oas [post] /notifications/{id}/resend
 * operationId: "PostNotificationsNotificationResend"
 * summary: "Resend Notification"
 * description: "Resends a previously sent notifications, with the same data but optionally to a different address"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Notification
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           to:
 *             description: "The address or user identifier that the Notification was sent to"
 *             type: string
 * tags:
 *   - Notification
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             notification:
 *               $ref: "#/components/schemas/notification"
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

  await notificationService.resend(id, config)

  const notification = await notificationService.retrieve(id, {
    select: defaultAdminNotificationsFields as (keyof Notification)[],
    relations: defaultAdminNotificationsRelations,
  })

  res.json({ notification })
}

export class AdminPostNotificationsNotificationResendReq {
  @IsOptional()
  @IsString()
  to?: string
}
