import {
  EventBusTypes,
  InterceptorSubscriber,
  InternalModuleDeclaration,
} from "@medusajs/types"
import { ulid } from "ulid"

export abstract class AbstractEventBusModuleService
  implements EventBusTypes.IEventBusModuleService
{
  protected isWorkerMode: boolean = true

  protected eventToSubscribersMap_: Map<
    string | symbol,
    EventBusTypes.SubscriberDescriptor[]
  > = new Map()

  protected interceptorSubscribers_: Set<InterceptorSubscriber> = new Set()

  public get eventToSubscribersMap(): Map<
    string | symbol,
    EventBusTypes.SubscriberDescriptor[]
  > {
    return this.eventToSubscribersMap_
  }

  protected constructor(
    cradle: Record<string, unknown>,
    moduleOptions = {},
    moduleDeclaration: InternalModuleDeclaration
  ) {
    this.isWorkerMode = moduleDeclaration.worker_mode !== "server"
  }

  abstract emit<T>(
    data: EventBusTypes.Message<T> | EventBusTypes.Message<T>[],
    options: Record<string, unknown>
  ): Promise<void>

  /*
    Grouped events are useful when you have distributed transactions
    where you need to explicitly group, release and clear events upon
    lifecycle events of a transaction.
  */
  // Given a eventGroupId, all the grouped events will be released
  abstract releaseGroupedEvents(eventGroupId: string): Promise<void>

  // Given a eventGroupId, all the grouped events will be cleared unless eventNames are provided
  // If eventNames are provided, only the events that match the eventNames will be cleared from the
  // group
  abstract clearGroupedEvents(
    eventGroupId: string,
    options?: {
      eventNames?: string[]
    }
  ): Promise<void>

  protected storeSubscribers({
    event,
    subscriberId,
    subscriber,
  }: {
    event: string | symbol
    subscriberId: string
    subscriber: EventBusTypes.Subscriber
  }) {
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
  }

  public subscribe(
    eventName: string | symbol,
    subscriber: EventBusTypes.Subscriber,
    context?: EventBusTypes.SubscriberContext
  ): this {
    if (typeof subscriber !== `function`) {
      throw new Error("Subscriber must be a function")
    }
    /**
     * If context is provided, we use the subscriberId from it
     * otherwise we generate a random using a ulid
     */

    const event = eventName.toString()
    const subscriberId = context?.subscriberId ?? `${event}-${ulid()}`

    ;(subscriber as any).subscriberId = subscriberId

    this.storeSubscribers({
      event,
      subscriberId,
      subscriber,
    })

    return this
  }

  unsubscribe(
    eventName: string | symbol,
    subscriber: EventBusTypes.Subscriber,
    context?: EventBusTypes.SubscriberContext
  ): this {
    if (!this.isWorkerMode) {
      return this
    }

    const existingSubscribers = this.eventToSubscribersMap_.get(eventName)
    const subscriberId =
      context?.subscriberId ?? (subscriber as any).subscriberId

    if (existingSubscribers?.length) {
      const subIndex = existingSubscribers?.findIndex(
        (sub) => sub.id === subscriberId
      )

      if (subIndex !== -1) {
        this.eventToSubscribersMap_
          .get(eventName)
          ?.splice(subIndex as number, 1)
      }
    }

    return this
  }

  /**
   * Add an interceptor subscriber that receives all messages before they are emitted
   *
   * @param interceptor - Function that receives messages before emission
   * @returns this for chaining
   */
  public addInterceptor(interceptor: InterceptorSubscriber): this {
    this.interceptorSubscribers_.add(interceptor)
    return this
  }

  /**
   * Remove an interceptor subscriber
   *
   * @param interceptor - Function to remove from interceptors
   * @returns this for chaining
   */
  public removeInterceptor(interceptor: InterceptorSubscriber): this {
    this.interceptorSubscribers_.delete(interceptor)
    return this
  }

  /**
   * Call all interceptor subscribers with the message before emission
   * This should be called by implementations before emitting events
   *
   * @param message - The message to be intercepted
   * @param context - Optional context about the emission
   */
  protected async callInterceptors<T = unknown>(
    message: EventBusTypes.Message<T>,
    context?: { isGrouped?: boolean; eventGroupId?: string }
  ): Promise<void> {
    Array.from(this.interceptorSubscribers_).map(async (interceptor) => {
      try {
        await interceptor(message, context)
      } catch (error) {
        // Log error but don't stop other interceptors or the emission
        console.error("Error in event bus interceptor:", error)
      }
    })
  }
}

export * from "./build-event-messages"
export * from "./common-events"
export * from "./message-aggregator"
export * from "./utils"
