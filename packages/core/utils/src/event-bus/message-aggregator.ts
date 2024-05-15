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

  save(message: Message | Message[]): void {
    if (!message || (Array.isArray(message) && message.length === 0)) return

    if (Array.isArray(message)) {
      this.messages.push(...message)
    } else {
      this.messages.push(message)
    }
  }

  saveRawMessageData<T>(
    messageData:
      | EventBusTypes.MessageFormat<T>
      | EventBusTypes.MessageFormat<T>[],
    options?: EventBusTypes.Option
  ) {
    this.save(buildEventMessages(messageData, options))
  }

  getMessages(format?: MessageAggregatorFormat): {
    [group: string]: Message[]
  } {
    const { groupBy, sortBy } = format || {}
    const messagesCopy = sortBy ? [...this.messages] : this.messages

    if (sortBy) {
      messagesCopy.sort((a, b) => this.compareMessages(a, b, sortBy!))
    }

    let messages: { [group: string]: Message[] } = { default: this.messages }

    if (groupBy) {
      messages = messagesCopy.reduce((acc, msg) => {
        const key = groupBy
          .map((field) => this.getValueFromPath(msg, field))
          .join("-")

        acc[key] = acc[key] || []
        acc[key].push(msg)

        return acc
      }, {} as { [group: string]: Message[] })
    }

    return messages
  }

  clearMessages() {
    this.messages = []
  }

  private getValueFromPath(obj: any, path: string) {
    return path.split(".").reduce((o, key) => (o ? o[key] : undefined), obj)
  }

  private compareMessages(
    a: Message,
    b: Message,
    sortBy: MessageAggregatorFormat["sortBy"]
  ): number {
    if (!sortBy) return 0

    for (const key of Object.keys(sortBy)) {
      const orderCriteria = sortBy[key]
      const valueA = this.getValueFromPath(a, key)
      const valueB = this.getValueFromPath(b, key)

      if (Array.isArray(orderCriteria)) {
        const indexA = orderCriteria.indexOf(valueA)
        const indexB = orderCriteria.indexOf(valueB)

        if (indexA === indexB) continue
        else if (indexA === -1) return 1
        else if (indexB === -1) return -1

        return indexA - indexB
      } else {
        const orderMultiplier =
          orderCriteria === "desc" || orderCriteria === -1 ? -1 : 1

        if (valueA === valueB) continue
        else if (valueA < valueB) return -1 * orderMultiplier

        return 1 * orderMultiplier
      }
    }
    return 0
  }
}
