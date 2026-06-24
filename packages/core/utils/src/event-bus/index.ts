import {
  EventBusTypes,
  EventMetadata,
  InterceptorSubscriber,
  InternalModuleDeclaration,
} from "@medusajs/types"
import { ulid } from "ulid"

/**
 * An abstract class for event bus module providers. Extend this class to create a custom event bus provider.
 */
export abstract class AbstractEventBusModuleService
  implements EventBusTypes.IEventBusModuleService
{
  protected isWorkerMode: boolean = true

  protected eventToSubscribersMap_: Map<
    string | symbol,
    EventBusTypes.SubscriberDescriptor[]
  > = new Map()

  protected interceptorSubscribers_: Set<InterceptorSubscriber> = new Set()

  /**
   * A map of event names to their registered subscriber descriptors.
   */
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

  /**
   * This method emits one or more events to the event bus.
   *
   * @param {EventBusTypes.Message<T> | EventBusTypes.Message<T>[]} data - The event or events to emit.
   * @param {Record<string, unknown>} options - Options to pass to the event bus implementation.
   * @returns {Promise<void>} Resolves when the events have been emitted.
   *
   * @example
   * class MyEventBus extends AbstractEventBusModuleService {
   *   async emit(data, options) {
   *     const messages = Array.isArray(data) ? data : [data]
   *     for (const message of messages) {
   *       await this.broker.publish(message.name, message.data)
   *     }
   *   }
   * }
   */
  abstract emit<T>(
    data: EventBusTypes.Message<T> | EventBusTypes.Message<T>[],
    options: Record<string, unknown>
  ): Promise<void>

  /**
   * This method releases all grouped events with the specified group ID, emitting them to the event bus.
   *
   * @param {string} eventGroupId - The ID of the event group to release.
   * @returns {Promise<void>} Resolves when the grouped events have been released.
   *
   * @example
   * class MyEventBus extends AbstractEventBusModuleService {
   *   async releaseGroupedEvents(eventGroupId) {
   *     const events = await this.store.getGroup(eventGroupId)
   *     await this.emit(events, {})
   *     await this.store.deleteGroup(eventGroupId)
   *   }
   * }
   */
  abstract releaseGroupedEvents(eventGroupId: string): Promise<void>

  /**
   * This method clears grouped events with the specified group ID without emitting them.
   *
   * @param {string} eventGroupId - The ID of the event group to clear.
   * @param {{ eventNames?: string[] }} [options] - Options to filter which events to clear. If `eventNames` is provided, only events matching those names are cleared.
   * @returns {Promise<void>} Resolves when the grouped events have been cleared.
   *
   * @example
   * class MyEventBus extends AbstractEventBusModuleService {
   *   async clearGroupedEvents(eventGroupId, options) {
   *     if (options?.eventNames?.length) {
   *       await this.store.deleteByNames(eventGroupId, options.eventNames)
   *     } else {
   *       await this.store.deleteGroup(eventGroupId)
   *     }
   *   }
   * }
   */
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

  /**
   * This method subscribes a handler function to an event.
   *
   * @param {string | symbol} eventName - The name of the event to subscribe to.
   * @param {EventBusTypes.Subscriber} subscriber - The handler function to invoke when the event is emitted.
   * @param {EventBusTypes.SubscriberContext} [context] - Optional context used to identify the subscriber.
   * @returns {this} The current instance for chaining.
   *
   * @example
   * eventBusService.subscribe("order.placed", async (event) => {
   *   console.log("Order placed:", event.data)
   * })
   */
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

  /**
   * This method removes a previously registered subscriber from an event.
   *
   * @param {string | symbol} eventName - The name of the event to unsubscribe from.
   * @param {EventBusTypes.Subscriber} subscriber - The handler function to remove.
   * @param {EventBusTypes.SubscriberContext} [context] - Optional context used to identify the subscriber.
   * @returns {this} The current instance for chaining.
   *
   * @example
   * const handler = async (event) => {
   *   console.log("Order placed:", event.data)
   * }
   * eventBusService.subscribe("order.placed", handler)
   * eventBusService.unsubscribe("order.placed", handler)
   */
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

  /**
   * Adds `created_at` to event metadata when an event is emitted.
   */
  protected withCreatedAtMetadata(metadata?: EventMetadata): EventMetadata {
    return {
      ...metadata,
      created_at: new Date(),
    }
  }

  /**
   * Adds `published_at` to event metadata when an event is published to the event bus.
   */
  protected withPublishedAtMetadata(metadata?: EventMetadata): EventMetadata {
    return {
      ...metadata,
      published_at: new Date(),
    }
  }

  /**
   * Parses date metadata fields after JSON serialization.
   */
  protected parseEventMetadataDates(
    metadata?: EventMetadata
  ): EventMetadata | undefined {
    if (!metadata) {
      return metadata
    }

    return {
      ...metadata,
      ...(metadata.created_at != null
        ? {
            created_at: new Date(metadata.created_at),
          }
        : {}),
      ...(metadata.published_at != null
        ? {
            published_at: new Date(metadata.published_at),
          }
        : {}),
    }
  }
}

export * from "./build-event-messages"
export * from "./common-events"
export * from "./message-aggregator"
export * from "./utils"
