import { Context, EventBusTypes } from "@medusajs/types"
import { CommonEvents } from "./common-events"

/**
 * Builds messages from message data to be consumed by the event bus and emitted to the consumer
 * @param MessageFormat The message data or array of message data to be processed
 * @param options Options to be passed to the event bus
 */
export function buildEventMessages<T>(
  messageData:
    | EventBusTypes.MessageFormat<T>
    | EventBusTypes.MessageFormat<T>[],
  options?: EventBusTypes.Option
): EventBusTypes.Message<T>[] {
  const messageDataArray = Array.isArray(messageData)
    ? messageData
    : [messageData]

  return messageDataArray.flatMap(({ data, eventName, metadata }) =>
    Array.isArray(data)
      ? data.map((bodyData) => composeMessage(eventName, bodyData, metadata))
      : [composeMessage(eventName, data, metadata, options)]
  )
}

/**
 * Composes and normalizes a message to be emitted by the EventBus module.
 * @param eventName The name of the event to be emitted.
 * @param data The content of the message.
 * @param metadata Metadata of the message
 * @param context Contextual information from the caller service.
 * @param options Options to be passed to the event bus.
 */
function composeMessage<T>(
  eventName: string,
  data: T,
  metadata: EventBusTypes.Metadata,
  options?: EventBusTypes.Option
): EventBusTypes.Message<T> {
  const { service, object, action, eventGroupId } = metadata
  const finalAction = action || eventName.split(".").pop()!

  if (
    !action &&
    !Object.values(CommonEvents).includes(finalAction as CommonEvents)
  ) {
    throw new Error("Action is required if eventName is not a CommonEvent")
  }

  const messageMetadata: EventBusTypes.MessageBody["metadata"] = {
    service,
    object,
    action: finalAction,
  }

  if (eventGroupId) {
    messageMetadata.eventGroupId = eventGroupId
  }

  return {
    eventName,
    body: {
      metadata: messageMetadata,
      data,
    },
    options,
  }
}
