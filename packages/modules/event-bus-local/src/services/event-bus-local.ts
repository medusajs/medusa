import {
  Event,
  EventBusTypes,
  InternalModuleDeclaration,
  Logger,
  MedusaContainer,
  Message,
  Subscriber,
} from "@medusajs/framework/types"
import { AbstractEventBusModuleService } from "@medusajs/framework/utils"
import { EventEmitter } from "events"
import { setTimeout } from "timers/promises"

type InjectedDependencies = {
  logger: Logger
}

type StagingQueueType = Map<string, Message[]>

const eventEmitter = new EventEmitter()
eventEmitter.setMaxListeners(Infinity)

// eslint-disable-next-line max-len
export default class LocalEventBusService extends AbstractEventBusModuleService {
  protected readonly logger_: Logger
  protected readonly eventEmitter_: EventEmitter
  protected groupedEventsMap_: StagingQueueType

  constructor(
    { logger }: MedusaContainer & InjectedDependencies,
    moduleOptions = {},
    moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.logger_ = logger ?? console
    this.eventEmitter_ = eventEmitter
    this.groupedEventsMap_ = new Map()
  }

  private logProcessingEvent(
    eventData: Message,
    options: Record<string, unknown> = {},
    totalSubscribers: number
  ) {
    if (
      totalSubscribers &&
      !options?.internal &&
      !eventData.options?.internal
    ) {
      this.logger_.info(
        `Processing ${eventData.name} which has ${totalSubscribers} subscribers`
      )
    }
  }

  /**
   * Accept an event name and some options
   *
   * @param eventsData
   * @param options The options can include `internal` which will prevent the event from being logged
   */
  async emit<T = unknown>(
    eventsData: Message<T> | Message<T>[],
    options: Record<string, unknown> = {}
  ): Promise<void> {
    const normalizedEventsData = Array.isArray(eventsData)
      ? eventsData
      : [eventsData]

    for (const eventData of normalizedEventsData) {
      await this.groupOrEmitEvent({
        ...eventData,
        options,
      })
    }
  }

  // If the data of the event consists of a eventGroupId, we don't emit the event, instead
  // we add them to a queue grouped by the eventGroupId and release them when
  // explicitly requested.
  // This is useful in the event of a distributed transaction where you'd want to emit
  // events only once the transaction ends.
  private async groupOrEmitEvent<T = unknown>(eventData: Message<T>) {
    const { options, ...eventBody } = eventData
    const eventGroupId = eventBody.metadata?.eventGroupId
    const hasStarSubscriber = this.eventEmitter_.listenerCount("*") > 0

    if (eventGroupId) {
      await this.groupEvent(eventGroupId, eventData)
    } else {
      const options_ = eventData.options as { delay: number }
      const delay = (ms?: number) => (ms ? setTimeout(ms) : Promise.resolve())

      const eventListenersCount = this.eventEmitter_.listenerCount(
        eventData.name
      )

      delay(options_?.delay).then(async () => {
        // Call interceptors before emitting
        void this.callInterceptors(eventData, { isGrouped: false })

        if (eventListenersCount) {
          this.eventEmitter_.emit(eventData.name, eventBody)
        }

        if (hasStarSubscriber) {
          this.eventEmitter_.emit("*", eventBody)
        }

        const totalSubscribers =
          eventListenersCount + (hasStarSubscriber ? 1 : 0)
        this.logProcessingEvent(eventData, options, totalSubscribers)
      })
    }
  }

  // Groups an event to a queue to be emitted upon explicit release
  private async groupEvent<T = unknown>(
    eventGroupId: string,
    eventData: Message<T>
  ) {
    const groupedEvents = this.groupedEventsMap_.get(eventGroupId) || []

    groupedEvents.push(eventData)

    this.groupedEventsMap_.set(eventGroupId, groupedEvents)
  }

  async releaseGroupedEvents(eventGroupId: string) {
    let groupedEvents = this.groupedEventsMap_.get(eventGroupId) || []
    groupedEvents = JSON.parse(JSON.stringify(groupedEvents))

    const hasStarSubscriber = this.eventEmitter_.listenerCount("*") > 0

    for (const event of groupedEvents) {
      const { options, ...eventBody } = event

      const eventListenersCount = this.eventEmitter_.listenerCount(event.name)

      const options_ = options as { delay: number }
      const delay = (ms?: number) => (ms ? setTimeout(ms) : Promise.resolve())

      delay(options_?.delay).then(async () => {
        // Call interceptors before emitting grouped events
        void this.callInterceptors(event, { isGrouped: true, eventGroupId })

        if (eventListenersCount) {
          this.eventEmitter_.emit(event.name, eventBody)
        }

        if (hasStarSubscriber) {
          this.eventEmitter_.emit("*", eventBody)
        }

        const totalSubscribers =
          eventListenersCount + (hasStarSubscriber ? 1 : 0)
        this.logProcessingEvent(event, options, totalSubscribers)
      })
    }

    await this.clearGroupedEvents(eventGroupId)
  }

  async clearGroupedEvents(
    eventGroupId: string,
    { eventNames }: { eventNames?: string[] } = {}
  ) {
    if (eventNames?.length) {
      const groupedEvents = this.groupedEventsMap_.get(eventGroupId) || []
      const eventsToKeep = groupedEvents.filter(
        (event) => !eventNames!.includes(event.name)
      )
      this.groupedEventsMap_.set(eventGroupId, eventsToKeep)
    } else {
      this.groupedEventsMap_.delete(eventGroupId)
    }
  }

  subscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: EventBusTypes.SubscriberContext
  ): this {
    super.subscribe(event, subscriber, context)

    const subscriberId =
      context?.subscriberId ?? (subscriber as any).subscriberId

    const wrappedSubscriber = async (data: Event) => {
      try {
        await subscriber(data)
      } catch (err) {
        this.logger_.error(
          `An error occurred while processing ${event.toString()}:`
        )
        this.logger_.error(err)
      }
    }

    if (subscriberId) {
      ;(wrappedSubscriber as any).subscriberId = subscriberId
    }

    this.eventEmitter_.on(event, wrappedSubscriber)

    return this
  }

  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context: EventBusTypes.SubscriberContext
  ): this {
    super.unsubscribe(event, subscriber, context)

    const subscriberId =
      context?.subscriberId ?? (subscriber as any).subscriberId

    if (subscriberId) {
      const listeners = this.eventEmitter_.listeners(event)
      const wrappedSubscriber = listeners.find(
        (listener) => (listener as any).subscriberId === subscriberId
      )

      if (wrappedSubscriber) {
        this.eventEmitter_.off(event, wrappedSubscriber as any)
      }
    } else {
      this.eventEmitter_.off(event, subscriber)
    }

    return this
  }
}
