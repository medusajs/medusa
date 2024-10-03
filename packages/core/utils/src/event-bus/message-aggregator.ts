import {
  Context,
  EventBusTypes,
  IMessageAggregator,
  Message,
  MessageAggregatorFormat,
} from "@medusajs/types"

import { composeMessage } from "./build-event-messages"

export class MessageAggregator implements IMessageAggregator {
  private messages: Message[] = []

  constructor() {}

  count(): number {
    return this.messages.length
  }

  save(msg: Message | Message[]): void {
    const messages = Array.isArray(msg) ? msg : [msg]
    if (messages.length === 0) {
      return
    }

    this.messages.push(...messages)
  }

  saveRawMessageData<T>(
    messageData:
      | EventBusTypes.RawMessageFormat<T>
      | EventBusTypes.RawMessageFormat<T>[],
    {
      options,
      sharedContext,
    }: { options?: Record<string, unknown>; sharedContext?: Context } = {}
  ): void {
    const messages = Array.isArray(messageData) ? messageData : [messageData]
    const composedMessages = messages.map((message) => {
      return composeMessage(message.eventName, {
        data: message.data,
        source: message.source,
        object: message.object,
        action: message.action,
        options,
        context: sharedContext,
      })
    })
    this.save(composedMessages)
  }

  getMessages(format: MessageAggregatorFormat = {}): {
    [group: string]: Message[]
  } {
    const { groupBy, sortBy } = format ?? {}

    if (sortBy) {
      this.messages.sort((a, b) => this.compareMessages(a, b, sortBy))
    }

    let messages: { [group: string]: Message[] } = {
      default: [...this.messages],
    }

    if (groupBy) {
      messages = this.messages.reduce<{
        [key: string]: Message[]
      }>((acc, msg) => {
        const key = groupBy
          .map((field) => this.getValueFromPath(msg, field))
          .join("-")
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(msg)
        return acc
      }, {})
    }

    if (format.internal) {
      Object.values(messages).forEach((group) => {
        group.forEach((msg) => {
          msg.options = msg.options ?? {}
          msg.options.internal = format.internal
        })
      })
    }

    return messages
  }

  clearMessages(): void {
    // Ensure no references are left over in case something rely on messages
    this.messages.length = 0
  }

  private getValueFromPath(obj: any, path: string): any {
    const keys = path.split(".")
    return keys.reduce((acc, key) => {
      if (acc === undefined) return undefined
      return acc[key]
    }, obj)
  }

  private compareMessages(
    a: Message,
    b: Message,
    sortBy: MessageAggregatorFormat["sortBy"]
  ): number {
    for (const key of Object.keys(sortBy!)) {
      const orderCriteria = sortBy![key]
      const valueA = this.getValueFromPath(a, key)
      const valueB = this.getValueFromPath(b, key)

      // User defined order
      if (Array.isArray(orderCriteria)) {
        const indexA = orderCriteria.indexOf(valueA)
        const indexB = orderCriteria.indexOf(valueB)

        if (indexA === indexB) {
          continue
        } else if (indexA === -1) {
          return 1
        } else if (indexB === -1) {
          return -1
        } else {
          return indexA - indexB
        }
      } else {
        // Ascending or descending order
        let orderMultiplier = 1
        if (orderCriteria === "desc" || orderCriteria === -1) {
          orderMultiplier = -1
        }

        if (valueA === valueB) {
          continue
        } else if (valueA < valueB) {
          return -1 * orderMultiplier
        } else {
          return 1 * orderMultiplier
        }
      }
    }
    return 0
  }
}
