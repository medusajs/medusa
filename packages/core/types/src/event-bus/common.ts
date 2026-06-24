import { Context } from "../shared-context"

// TODO: Comment temporarely and we will re enable it in the near future #14478
// /**
//  * Configuration options for individual events.
//  */
// export interface EventOptions {
//   /**
//    * Priority level for the event processing.
//    * Lower numbers indicate higher priority.
//    */
//   priority?: number
// }

// /**
//  * Registry for event bus events options types.
//  * Events will be added to this registry to serve as a global configuration for all events
//  * as part of the event bus module service module options.
//  *
//  * Modules augment this interface using declaration merging to register their event configurations.
//  * Custom events can be added via declaration merging in your project.
//  */
// export interface EventBusEventsOptions {}

/**
 * A function that handles an event emitted by the event bus.
 */
export type Subscriber<TData = unknown> = (data: Event<TData>) => Promise<void>

/**
 * The context provided to a subscriber when registering it.
 */
export type SubscriberContext = {
  /**
   * The ID of the subscriber. Useful when retrying failed subscribers.
   */
  subscriberId: string
}

/**
 * Describes a registered event subscriber and its unique identifier.
 */
export type SubscriberDescriptor = {
  /**
   * The subscriber's ID.
   */
  id: string
  /**
   * The subscriber function.
   */
  subscriber: Subscriber
}

/**
 * Metadata attached to an emitted event.
 */
export type EventMetadata = Record<string, unknown> & {
  /**
   * The ID of the event's group. Grouped events are useful when you have distributed transactions
   * where you need to explicitly group, release and clear events upon lifecycle events of a transaction.
   *
   * When set, you must release the grouped events using the Event Module's `releaseGroupedEvents` method to emit the events.
   */
  eventGroupId?: string
  /**
   * The date the event was emitted.
   */
  created_at?: Date
  /**
   * The date the event was published to the event bus. If it's a grouped event, this will be the date the group was released.
   */
  published_at?: Date
}

/**
 * Represents an event emitted by the event bus.
 */
export type Event<TData = unknown> = {
  /**
   * The event's name.
   *
   * @example
   * user.created
   */
  name: string
  /**
   * Additional meadata to pass with the event.
   */
  metadata?: EventMetadata
  /**
   * The data payload that subscribers receive. For example, the ID or IDs of the created user. (e.g. { id: "123" } or { ids: ["123", "456"] })
   */
  data: TData
}

/**
 * The details of an event to emit.
 */
export type Message<TData = unknown> = Event<TData> & {
  options?: Record<string, unknown>
}

/**
 * The raw format of a message before it is processed by the event bus.
 */
export type RawMessageFormat<TData = any> = {
  /**
   * The name of the event.
   */
  eventName: string
  /**
   * The data payload of the event.
   */
  data: TData
  /**
   * The source module emitting the event.
   */
  source: string
  /**
   * The object type associated with the event.
   */
  object: string
  /**
   * The action that triggered the event.
   */
  action?: string
  /**
   * Optional context, such as an event group ID.
   */
  context?: Pick<Context, "eventGroupId">
  /**
   * Additional options for the event.
   */
  options?: Record<string, any>
}

/**
 * A function that intercepts messages before they are emitted by the event bus.
 */
export type InterceptorSubscriber<T = unknown> = (
  message: Message<T>,
  context?: { isGrouped?: boolean; eventGroupId?: string }
) => Promise<void> | void
