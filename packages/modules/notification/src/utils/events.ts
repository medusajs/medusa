import {
  CommonEvents,
  moduleEventBuilderFactory,
  Modules,
  NotificationEvents,
} from "@medusajs/framework/utils"

export const eventBuilders = {
  createdNotification: moduleEventBuilderFactory({
    source: Modules.NOTIFICATION,
    action: CommonEvents.CREATED,
    object: "notification",
    eventName: NotificationEvents.NOTIFICATION_CREATED,
  }),
}
