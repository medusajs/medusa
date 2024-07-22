import { model } from "@medusajs/utils"
import { NotificationProvider } from "./notification-provider"

// We probably want to have a TTL for each entry, so we don't bloat the DB (and also for GDPR reasons if TTL < 30 days).
export const Notification = model.define("notification", {
  id: model.id({ prefix: "noti" }).primaryKey(),
  // This can be an email, phone number, or username, depending on the channel.
  to: model.text().searchable(),
  channel: model.text(),
  // The template name in the provider's system.
  template: model.text(),
  // The data that gets passed over to the provider for rendering the notification.
  data: model.json().nullable(),
  // This can be the event name, the workflow, or anything else that can help to identify what triggered the notification.
  trigger_type: model.text().nullable(),
  // The ID of the resource this notification is for, if applicable. Useful for displaying relevant information in the UI
  resource_id: model.text().searchable().nullable(),
  // The typeame of the resource this notification is for, if applicable, eg. "order"
  resource_type: model.text().nullable(),
  // The ID of the receiver of the notification, if applicable. This can be a customer, user, a company, or anything else.
  receiver_id: model.text().index().nullable(),
  // The original notification, in case this is a retried notification.
  original_notification_id: model.text().nullable(),
  idempotency_key: model.text().unique().nullable(),
  // The ID of the notification in the external system, if applicable
  external_id: model.text().nullable(),
  provider: model
    .belongsTo(() => NotificationProvider, { mappedBy: "notifications" })
    .nullable(),
})
