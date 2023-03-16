import {
    EmitData,
    IEventBusModuleService,
    Subscriber,
    SubscriberContext,
    SubscriberDescriptor
} from "@medusajs/types"
import { ulid } from "ulid"

export abstract class AbstractEventBusModuleService
  implements IEventBusModuleService
{
  protected eventToSubscribersMap_: Map<
    string | symbol,
    SubscriberDescriptor[]
  > = new Map()

  public get eventToSubscribersMap(): Map<
    string | symbol,
    SubscriberDescriptor[]
  > {
    return this.eventToSubscribersMap_
  }

  abstract emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>
  abstract emit<T>(data: EmitData<T>[]): Promise<void>

  public subscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this {
    if (typeof subscriber !== `function`) {
      throw new Error("Subscriber must be a function")
    }
    /**
     * If context is provided, we use the subscriberId from it
     * otherwise we generate a random using a ulid
     */

    const randId = ulid()
    const event = eventName.toString()

    const subscriberId = context?.subscriberId ?? `${event}-${randId}`

    const newSubscriberDescriptor = { subscriber, id: subscriberId }

    const existingSubscribers = this.eventToSubscribersMap_.get(event) ?? []

    const subscriberAlreadyExists = existingSubscribers.find(
      (sub) => sub.id === subscriberId
    )

    if (subscriberAlreadyExists) {
      throw Error(`Subscriber with id ${subscriberId} already exists`)
    }

    this.eventToSubscribersMap_.set(event, [
      ...existingSubscribers,
      newSubscriberDescriptor,
    ])

    return this
  }

  unsubscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context: SubscriberContext
  ): this {
    if (typeof subscriber !== `function`) {
      throw new Error("Subscriber must be a function")
    }

    const existingSubscribers = this.eventToSubscribersMap_.get(eventName)

    if (existingSubscribers?.length) {
      const subIndex = existingSubscribers?.findIndex(
        (sub) => sub.id === context?.subscriberId
      )

      if (subIndex !== -1) {
        this.eventToSubscribersMap_.get(eventName)?.splice(subIndex as number, 1)
      }
    }

    return this
  }
}
