import { IEventBusService, INotificationModuleService } from "@medusajs/types"
import { get } from "lodash"

type InjectedDependencies = {
  notificationModuleService: INotificationModuleService
  eventBusModuleService: IEventBusService
}

// TODO: The config should be loaded dynamically from medusa-config.js
// TODO: We can use a more powerful templating syntax to allow for eg. combining fields.
const config = [
  {
    event: "order.created",
    template: "order-created-template",
    channel: "email",
    to: "order.email",
    resource_id: "order.id",
    data: {
      order_id: "order.id",
    },
  },
]

class ConfigurableNotificationsSubscriber {
  private readonly eventBusModuleService_: IEventBusService
  private readonly notificationModuleService_: INotificationModuleService

  constructor({
    eventBusModuleService,
    notificationModuleService,
  }: InjectedDependencies) {
    this.eventBusModuleService_ = eventBusModuleService
    this.notificationModuleService_ = notificationModuleService

    config.forEach((eventHandler) => {
      this.eventBusModuleService_.subscribe(
        eventHandler.event,
        async (data: any) => {
          const payload = data.data

          const notificationData = {
            template: eventHandler.template,
            channel: eventHandler.channel,
            to: get(payload, eventHandler.to),
            trigger_type: eventHandler.event,
            resource_id: get(payload, eventHandler.resource_id),
            data: Object.entries(eventHandler.data).reduce(
              (acc, [key, value]) => {
                acc[key] = get(payload, value)
                return acc
              },
              {}
            ),
          }

          await this.notificationModuleService_.create(notificationData)
          return
        }
      )
    })
  }
}

export default ConfigurableNotificationsSubscriber
