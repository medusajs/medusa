import { ulid } from "ulid"
import { StagedJob } from "../../models"
import { TransactionBaseService } from "../transaction-base-service"

export type Subscriber<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export type SubscriberContext = {
  subscriberId: string
}

export type SubscriberDescriptor = {
  id: string
  subscriber: Subscriber
}

export type EventHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export interface IEventBusService extends TransactionBaseService {
  emit<T>(
    eventName: string,
    data: T,
    options?: unknown
  ): Promise<StagedJob | void>
}

export interface IEventBusModuleService {
  emit<T>(
    eventName: string,
    data: T,
    options?: unknown
  ): Promise<StagedJob | void>

  subscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this

  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this
}

export abstract class AbstractEventBusModuleService
  implements IEventBusModuleService
{
  protected eventToSubscribersMap_: Map<
    string | symbol,
    SubscriberDescriptor[]
  > = new Map()

  protected get eventToSubscribersMap(): Map<
    string | symbol,
    SubscriberDescriptor[]
  > {
    return this.eventToSubscribersMap_
  }

  abstract emit<T>(eventName: string, data: T, options?: unknown): Promise<void>

  public subscribe(
    event: string | symbol,
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
    const subscriberId =
      context?.subscriberId ?? `${event.toString()}-${ulid()}`

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
    event: string | symbol,
    subscriber: Subscriber,
    context: SubscriberContext
  ): this {
    if (typeof subscriber !== `function`) {
      throw new Error("Subscriber must be a function")
    }

    const existingSubscribers = this.eventToSubscribersMap_.get(event)

    if (existingSubscribers?.length) {
      const subIndex = existingSubscribers?.findIndex(
        (sub) => sub.id === context?.subscriberId
      )

      if (subIndex !== -1) {
        this.eventToSubscribersMap_.get(event)?.splice(subIndex as number, 1)
      }
    }

    return this
  }
}
