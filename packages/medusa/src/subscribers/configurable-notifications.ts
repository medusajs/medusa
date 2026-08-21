import { INotificationModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  OrderWorkflowEvents,
  pickValueFromObject,
  promiseAll,
} from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"

type MedusaContainer = SubscriberArgs<any>["container"]

type HandlerConfig = {
  event: string
  template: string
  channel: string
  to: string
  resource_id: string
  data: Record<string, string>
  /**
   * Workflow events carry `{ id }` payloads, while the path templates above
   * read fields off the resource itself. Optional per-handler loader that
   * resolves the payload into the shape the paths expect; returning
   * undefined skips the notification.
   */
  resolve?: (
    data: Record<string, any>,
    container: MedusaContainer
  ) => Promise<Record<string, any> | undefined>
}

// TODO: The config should be loaded dynamically from medusa-config.js
// TODO: We can use a more powerful templating syntax to allow for eg. combining fields.
const handlerConfig: HandlerConfig[] = [
  {
    // `order.created` is never emitted: the order module has no CREATED
    // workflow event, and the ORM-derived `order.order.created` that does
    // fire would also cover drafts and admin-created orders. `order.placed`
    // is emitted by completeCartWorkflow (and draft-order conversion), which
    // is when a confirmation email is actually wanted (#16555).
    event: OrderWorkflowEvents.PLACED,
    template: "order-placed-template",
    channel: "email",
    to: "order.email",
    resource_id: "order.id",
    data: {
      order_id: "order.id",
    },
    resolve: async (data, container) => {
      const query = container.resolve(ContainerRegistrationKeys.QUERY)

      const { data: orders } = await query.graph({
        entity: "orders",
        fields: ["id", "email"],
        filters: { id: data.id },
      })

      return orders[0] ? { order: orders[0] } : undefined
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
  event,
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const notificationService: INotificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )

  const handlers = configAsMap[event.name] ?? []

  await promiseAll(
    handlers.map(async (handler) => {
      let payload = event.data

      if (handler.resolve) {
        try {
          payload = await handler.resolve(event.data, container)
        } catch (err) {
          logger.error(
            `Failed to resolve payload for ${event.name} notification`,
            err.message
          )
          return
        }

        if (!payload) {
          logger.warn(
            `Skipped notification for ${event.name}: the resource behind the event could not be loaded`
          )
          return
        }
      }

      const notificationData = {
        template: handler.template,
        channel: handler.channel,
        to: pickValueFromObject(handler.to, payload),
        trigger_type: handler.event,
        resource_id: pickValueFromObject(handler.resource_id, payload),
        data: Object.entries(handler.data).reduce((acc, [key, value]) => {
          acc[key] = pickValueFromObject(value, payload)
          return acc
        }, {}),
      }

      // We don't want to fail all handlers, so we catch and log errors only
      try {
        await notificationService.createNotifications(notificationData)
      } catch (err) {
        logger.error(
          `Failed to send notification for ${event.name}`,
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
