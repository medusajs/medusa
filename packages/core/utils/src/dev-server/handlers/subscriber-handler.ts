import {
  ResourceEntry,
  ResourceTypeHandler,
  SubscriberResourceData,
} from "../types"

export class SubscriberHandler
  implements ResourceTypeHandler<SubscriberResourceData>
{
  readonly type = "subscriber"

  validate(data: SubscriberResourceData): void {
    if (!data.id) {
      throw new Error(
        `Subscriber registration requires id. Received: ${JSON.stringify(data)}`
      )
    }

    if (!data.sourcePath) {
      throw new Error(
        `Subscriber registration requires sourcePath. Received: ${JSON.stringify(
          data
        )}`
      )
    }

    if (!data.subscriberId) {
      throw new Error(
        `Subscriber registration requires subscriberId. Received: ${JSON.stringify(
          data
        )}`
      )
    }

    if (!data.events) {
      throw new Error(
        `Subscriber registration requires events. Received: ${JSON.stringify(
          data
        )}`
      )
    }

    if (!Array.isArray(data.events)) {
      throw new Error(
        `Subscriber registration requires events to be an array. Received: ${JSON.stringify(
          data
        )}`
      )
    }
  }

  resolveSourcePath(data: SubscriberResourceData): string {
    return data.sourcePath
  }

  createEntry(data: SubscriberResourceData): ResourceEntry {
    return {
      id: data.id,
      subscriberId: data.subscriberId,
      events: data.events,
    }
  }

  getInverseKey(data: SubscriberResourceData): string {
    return `${this.type}:${data.subscriberId}`
  }
}
