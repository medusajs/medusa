import {
  EventBusTypes,
  IMessageAggregator,
  Message,
  MessageAggregatorFormat,
} from "@medusajs/types"

import { buildEventMessages } from "./build-event-messages"

export class MessageAggregator implements IMessageAggregator {
  private messages: Message[]

  constructor() {
    this.messages = []
  }

  save(msg: Message | Message[]): void {
    if (!msg || (Array.isArray(msg) && msg.length === 0)) {
      return
    }

    if (Array.isArray(msg)) {
      this.messages.push(...msg)
    } else {
      this.messages.push(msg)
    }
  }

  saveRawMessageData<T>(
    messageData:
      | EventBusTypes.MessageFormat<T>
      | EventBusTypes.MessageFormat<T>[],
    options?: Record<string, unknown>
  ): void {
    this.save(buildEventMessages(messageData, options))
  }

  getMessages(format?: MessageAggregatorFormat): {
    [group: string]: Message[]
  } {
    const { groupBy, sortBy } = format ?? {}

    if (sortBy) {
      this.messages.sort((a, b) => this.compareMessages(a, b, sortBy))
    }

    let messages: { [group: string]: Message[] } = { default: this.messages }

    if (groupBy) {
      const groupedMessages = this.messages.reduce<{
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

      messages = groupedMessages
    }

    return messages
  }

  clearMessages(): void {
    this.messages = []
  }

  private getValueFromPath(obj: any, path: string): any {
    const keys = path.split(".")
    for (const key of keys) {
      obj = obj[key]
      if (obj === undefined) break
    }
    return obj
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
