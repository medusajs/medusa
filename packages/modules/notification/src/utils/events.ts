import {
  CommonEvents,
  moduleEventBuilderFactory,
  Modules,
  NotificationEvents,
} from "@medusajs/utils"

export const eventBuilders = {
  createdNotification: moduleEventBuilderFactory({
    source: Modules.NOTIFICATION,
    action: CommonEvents.CREATED,
    object: "notification",
    eventsEnum: NotificationEvents,
  }),
}
