import { EventBusTypes } from "@medusajs/types"

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
  const messages: EventBusTypes.Message<T>[] = []

  messageData_.map((data) => {
    const data_ = Array.isArray(data.data) ? data.data : [data.data]
    data_.forEach((bodyData) => {
      const message = {
        eventName: data.eventName,
        body: {
          metadata: data.metadata,
          data: bodyData,
        },
        options,
      }
      messages.push(message)
    })
  })

  return messages
}
