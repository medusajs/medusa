import { model } from "@medusajs/utils"
import { Notification } from "./notification"

export const NotificationProvider = model.define("notificationProvider", {
  id: model.id().primaryKey("notpro"),
  handle: model.text(),
  name: model.text(),
  is_enabled: model.boolean().default(true),
  channels: model.array().default([]),
  notifications: model.hasMany(() => Notification, { mappedBy: "provider" }),
})
