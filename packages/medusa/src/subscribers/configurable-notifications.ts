import { ConfigModule, INotificationModuleService } from "@medusajs/types"
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

const asMap = (handlerConfig: any[]) =>
  handlerConfig.reduce((acc: Record<string, HandlerConfig[]>, h) => {
    if (!acc[h.event]) {
      acc[h.event] = []
    }

    acc[h.event].push(h)
    return acc
  }, {})

export default async function configurableNotifications({
  data,
  eventName,
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const config: ConfigModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const notificationService: INotificationModuleService = container.resolve(
    ModuleRegistrationName.NOTIFICATION
  )

  const notificationsConfig = config.projectConfig?.notifications?.events ?? []
  const configAsMap = asMap(notificationsConfig)

  const handlers = configAsMap[eventName] ?? []
  const payload = data.data

  if (!handlers.length) {
    return
  }

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
  // event: handlerConfig.map((h) => h.event),
  // TODO: We need to add support for wildcard events
  event: "*",
  context: {
    subscriberId: "configurable-notifications-handler",
  },
}
