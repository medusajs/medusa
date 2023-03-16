import { Logger, MedusaContainer } from "@medusajs/medusa"
import { EventBusTypes } from "@medusajs/types"
import { EventBusUtils } from "@medusajs/utils"
import { EventEmitter } from "events"

type InjectedDependencies = {
  logger: Logger
}
const eventEmitter = new EventEmitter()

export default class LocalEventBusService extends EventBusUtils.AbstractEventBusModuleService {
  protected readonly logger_: Logger

  constructor({ logger }: MedusaContainer & InjectedDependencies) {
    // @ts-ignore
    super(...arguments)

    this.logger_ = logger
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
  async emit<T>(data: EventBusTypes.EmitData<T>[]): Promise<void>

  async emit<T, TInput extends string | EventBusTypes.EmitData<T>[] = string>(
    eventOrData: TInput,
    data?: T,
    options: Record<string, unknown> = {}
  ): Promise<void> {
    const isBulkEmit = Array.isArray(eventOrData)

    const events: EventBusTypes.EmitData[] = isBulkEmit
      ? eventOrData
      : [{ eventName: eventOrData, data }]

    for (const event of events) {
      const eventListenersCount = eventEmitter.listenerCount(event.eventName)

      if (eventListenersCount === 0) {
        continue
      }

      this.logger_.info(
        `Processing ${event.eventName} which has ${eventListenersCount} subscribers`
      )

      try {
        eventEmitter.emit(event.eventName, event.data)
      } catch (error) {
        this.logger_.error(
          `An error occurred while processing ${event.eventName}: ${error}`
        )
      }
    }
  }

  subscribe(
    event: string | symbol,
    subscriber: EventBusTypes.Subscriber
  ): this {
    eventEmitter.on(event, subscriber)
    return this
  }

  unsubscribe(
    event: string | symbol,
    subscriber: EventBusTypes.Subscriber
  ): this {
    eventEmitter.off(event, subscriber)
    return this
  }
}
