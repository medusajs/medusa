import { INotificationModuleService } from "@medusajs/types"
import { get } from "lodash"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"

type HandlerConfig = {
  event: string
  template: string
  channel: string
  to: string
  resource_id: string
  data: Record<string, string>
}

// TODO: The config should be loaded dynamically from medusa-config.js
// TODO: We can use a more powerful templating syntax to allow for eg. combining fields.
const handlerConfig: HandlerConfig[] = [
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

const configAsMap = handlerConfig.reduce(
  (acc: Record<string, HandlerConfig[]>, h) => {
    if (!acc[h.event]) {
      acc[h.event] = []
    }

    acc[h.event].push(h)
    return acc
  },
  {}
)

export default async function configurableNotifications({
  data,
  eventName,
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const notificationService: INotificationModuleService = container.resolve(
    ModuleRegistrationName.NOTIFICATION
  )

  const handlers = configAsMap[eventName] ?? []
  const payload = data.data

  await promiseAll(
    handlers.map(async (handler) => {
      const notificationData = {
        template: handler.template,
        channel: handler.channel,
        to: get(payload, handler.to),
        trigger_type: handler.event,
        resource_id: get(payload, handler.resource_id),
        data: Object.entries(handler.data).reduce((acc, [key, value]) => {
          acc[key] = get(payload, value)
          return acc
        }, {}),
      }

      // We don't want to fail all handlers, so we catch and log errors only
      try {
        await notificationService.createNotifications(notificationData)
      } catch (err) {
        logger.error(
          `Failed to send notification for ${eventName}`,
          err.message
        )
      }
    })
  )
}

export const config: SubscriberConfig = {
  event: handlerConfig.map((h) => h.event),
  context: {
    subscriberId: "configurable-notifications-handler",
  },
}
