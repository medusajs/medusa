type Message<T> = {
  eventName: string
  body: {
    metadata: {
      service: string
      action: string
      object: string
    }
    data: T
  }
}

type MessageData<T> = {
  eventName: string
  metadata: {
    service: string
    action: string
    object: string
  }
  data: T | T[]
}

/**
 * Build messages from message data to be consumed by the event bus and emitted to the consumer
 * @param messageData
 */
export function buildMessages<T>(
  messageData: MessageData<T> | MessageData<T>[]
): Message<T>[] {
  const messageData_ = Array.isArray(messageData) ? messageData : [messageData]
  const messages: Message<T>[] = []

  messageData_.map((data) => {
    const data_ = Array.isArray(data.data) ? data.data : [data.data]
    data_.forEach((bodyData) => {
      const message = {
        eventName: data.eventName,
        body: {
          metadata: data.metadata,
          data: bodyData,
        },
      }
      messages.push(message)
    })
  })

  return messages
}
