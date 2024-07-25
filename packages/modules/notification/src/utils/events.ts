import {
  CommonEvents,
  eventBuilderFactory,
  Modules,
  NotificationEvents,
} from "@medusajs/utils"

export const eventBuilders = {
  createdNotification: eventBuilderFactory({
    source: Modules.NOTIFICATION,
    action: CommonEvents.CREATED,
    object: "notification",
    eventsEnum: NotificationEvents,
  }),
}
