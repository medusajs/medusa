// TODO: Comment temporarely and we will re enable it in the near future #14478
// import { EventOptions } from "@zjedene-medusa/types"
import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: ["notification"] = ["notification"]

export const NotificationEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.NOTIFICATION
)

// TODO: Comment temporarely and we will re enable it in the near future #14478
// declare module "@zjedene-medusa/types" {
//   export interface EventBusEventsOptions {
//     // Notification events
//     [NotificationEvents.NOTIFICATION_CREATED]?: EventOptions
//     [NotificationEvents.NOTIFICATION_UPDATED]?: EventOptions
//     [NotificationEvents.NOTIFICATION_DELETED]?: EventOptions
//     [NotificationEvents.NOTIFICATION_RESTORED]?: EventOptions
//     [NotificationEvents.NOTIFICATION_ATTACHED]?: EventOptions
//     [NotificationEvents.NOTIFICATION_DETACHED]?: EventOptions
//   }
// }
