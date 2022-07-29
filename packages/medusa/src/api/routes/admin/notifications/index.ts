import { Router } from "express"
import { Notification } from "./../../../../"

const route = Router()

export default (app) => {
  app.use("/notifications", route)

  /**
   * List notifications
   */
  route.get("/", require("./list-notifications").default)

  /**
   * Resend a notification
   */
  route.post("/:id/resend", require("./resend-notification").default)

  return app
}

export const defaultAdminNotificationsRelations = ["resends"]
export const allowedAdminNotificationsRelations = ["resends"]

export const defaultAdminNotificationsFields = [
  "id",
  "resource_type",
  "resource_id",
  "event_name",
  "to",
  "provider_id",
  "created_at",
  "updated_at",
]

export const allowedAdminNotificationsFields = [
  "id",
  "resource_type",
  "resource_id",
  "provider_id",
  "event_name",
  "to",
  "created_at",
  "updated_at",
]

export type AdminNotificationsListRes = {
  notifications: Notification[]
}

export type AdminNotificationsRes = {
  notification: Notification
}

export * from "./list-notifications"
export * from "./resend-notification"
