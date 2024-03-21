import { Context, EventBusTypes } from "@medusajs/types"
import { CommonEvents } from "./common-events"

/**
 * Build messages from message data to be consumed by the event bus and emitted to the consumer
 * @param MessageFormat
 * @param options
 */
export function buildEventMessages<T>(
  messageData:
    | EventBusTypes.MessageFormat<T>
    | EventBusTypes.MessageFormat<T>[],
  options?: Record<string, unknown>
): EventBusTypes.Message<T>[] {
  const messageData_ = Array.isArray(messageData) ? messageData : [messageData]
  const messages: EventBusTypes.Message<any>[] = []

  messageData_.map((data) => {
    const data_ = Array.isArray(data.data) ? data.data : [data.data]
    data_.forEach((bodyData) => {
      const message = composeMessage(data.eventName, {
        data: bodyData,
        service: data.metadata.service,
        entity: data.metadata.object,
        action: data.metadata.action,
        context: {
          eventGroupId: data.metadata.eventGroupId,
        } as Context,
        options,
      })
      messages.push(message)
    })
  })

  return messages
}

/**
 * Helper function to compose and normalize a Message to be emitted by EventBus Module
 * @param eventName  Name of the event to be emitted
 * @param data The content of the message
 * @param metadata Metadata of the message
 * @param context Context from the caller service
 * @param options Options to be passed to the event bus
 */
export function composeMessage(
  eventName: string,
  {
    data,
    service,
    entity,
    action,
    context = {},
    options,
  }: {
    data: unknown
    service: string
    entity: string
    action?: string
    context?: Context
    options?: Record<string, unknown>
  }
): EventBusTypes.Message {
  const act = action || eventName.split(".").pop()
  if (!action && !Object.values(CommonEvents).includes(act as CommonEvents)) {
    throw new Error("Action is required if eventName is not a CommonEvent")
  }

  const metadata: EventBusTypes.MessageBody["metadata"] = {
    service,
    object: entity,
    action: act!,
  }

  if (context.eventGroupId) {
    metadata.eventGroupId = context.eventGroupId
  }

  return {
    eventName,
    body: {
      metadata,
      data,
    },
    options,
  }
}
