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

export type Subscriber<TData = unknown> = (data: Event<TData>) => Promise<void>

export type SubscriberContext = {
  /**
   * The ID of the subscriber. Useful when retrying failed subscribers.
   */
  subscriberId: string
}

export type SubscriberDescriptor = {
  id: string
  subscriber: Subscriber
}

export type EventMetadata = Record<string, unknown> & {
  /**
   * The ID of the event's group. Grouped events are useful when you have distributed transactions
   * where you need to explicitly group, release and clear events upon lifecycle events of a transaction.
   *
   * When set, you must release the grouped events using the Event Module's `releaseGroupedEvents` method to emit the events.
   */
  eventGroupId?: string
}

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

export type RawMessageFormat<TData = any> = {
  eventName: string
  data: TData
  source: string
  object: string
  action?: string
  context?: Pick<Context, "eventGroupId">
  options?: Record<string, any>
}

export type InterceptorSubscriber<T = unknown> = (
  message: Message<T>,
  context?: { isGrouped?: boolean; eventGroupId?: string }
) => Promise<void> | void
