import { MedusaContainer } from "@medusajs/modules-sdk"
import {
  EmitData,
  EventBusTypes,
  Logger,
  Message,
  Subscriber,
} from "@medusajs/types"
import { AbstractEventBusModuleService } from "@medusajs/utils"
import { EventEmitter } from "events"
import { ulid } from "ulid"

type InjectedDependencies = {
  logger: Logger
}

type StagingQueueType = Map<string, { eventName: string; data?: unknown }[]>

const eventEmitter = new EventEmitter()
eventEmitter.setMaxListeners(Infinity)

// eslint-disable-next-line max-len
export default class LocalEventBusService extends AbstractEventBusModuleService {
  protected readonly logger_?: Logger
  protected readonly eventEmitter_: EventEmitter
  protected groupedEventsMap_: StagingQueueType

  constructor({ logger }: MedusaContainer & InjectedDependencies) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.logger_ = logger
    this.eventEmitter_ = eventEmitter
    this.groupedEventsMap_ = new Map()
  }

  async emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>

  /**
   * Emit a number of events
   * @param {EmitData} data - the data to send to the subscriber.
   */
  async emit<T>(data: EmitData<T>[]): Promise<void>

  async emit<T>(data: Message<T>[]): Promise<void>

  async emit<T, TInput extends string | EmitData<T>[] | Message<T>[] = string>(
    eventOrData: TInput,
    data?: T,
    options: Record<string, unknown> = {}
  ): Promise<void> {
    const isBulkEmit = Array.isArray(eventOrData)

    const events: EmitData[] | Message<T>[] = isBulkEmit
      ? eventOrData
      : [{ eventName: eventOrData, data }]

    for (const event of events) {
      const eventListenersCount = this.eventEmitter_.listenerCount(
        event.eventName
      )

      this.logger_?.info(
        `Processing ${event.eventName} which has ${eventListenersCount} subscribers`
      )

      if (eventListenersCount === 0) {
        continue
      }

      const data = (event as EmitData).data ?? (event as Message<T>).body

      await this.groupOrEmitEvent(event.eventName, data)
    }
  }

  // If the data of the event consists of a eventGroupId, we don't emit the event, instead
  // we add them to a queue grouped by the eventGroupId and release them when
  // explicitly requested.
  // This is useful in the event of a distributed transaction where you'd want to emit
  // events only once the transaction ends.
  private async groupOrEmitEvent(
    eventName: string,
    data: unknown & { eventGroupId?: string }
  ) {
    const { eventGroupId, ...eventData } = data

    if (eventGroupId) {
      await this.groupEvent(eventGroupId, eventName, eventData)
    } else {
      this.eventEmitter_.emit(eventName, data)
    }
  }

  // Groups an event to a queue to be emitted upon explicit release
  private async groupEvent(
    eventGroupId: string,
    eventName: string,
    data: unknown
  ) {
    const groupedEvents = this.groupedEventsMap_.get(eventGroupId) || []

    groupedEvents.push({ eventName, data })

    this.groupedEventsMap_.set(eventGroupId, groupedEvents)
  }

  async releaseGroupedEvents(eventGroupId: string) {
    const groupedEvents = this.groupedEventsMap_.get(eventGroupId) || []

    for (const event of groupedEvents) {
      const { eventName, data } = event

      this.eventEmitter_.emit(eventName, data)
    }

    this.clearGroupedEvents(eventGroupId)
  }

  async clearGroupedEvents(eventGroupId: string) {
    this.groupedEventsMap_.delete(eventGroupId)
  }

  subscribe(event: string | symbol, subscriber: Subscriber): this {
    const randId = ulid()
    this.storeSubscribers({ event, subscriberId: randId, subscriber })
    this.eventEmitter_.on(event, async (...args) => {
      try {
        // @ts-ignore
        await subscriber(...args)
      } catch (e) {
        this.logger_?.error(
          `An error occurred while processing ${event.toString()}: ${e}`
        )
      }
    })
    return this
  }

  unsubscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: EventBusTypes.SubscriberContext
  ): this {
    const existingSubscribers = this.eventToSubscribersMap_.get(event)

    if (existingSubscribers?.length) {
      const subIndex = existingSubscribers?.findIndex(
        (sub) => sub.id === context?.subscriberId
      )

      if (subIndex !== -1) {
        this.eventToSubscribersMap_.get(event)?.splice(subIndex as number, 1)
      }
    }

    this.eventEmitter_.off(event, subscriber)
    return this
  }
}
