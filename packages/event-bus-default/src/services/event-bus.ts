import { ConfigModule, IEventBusService, Logger, MedusaContainer, TransactionBaseService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  logger: Logger
}

type EventHandler<T = unknown> = (data: T, eventName: string) => Promise<void>

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
export default class DefaultEventBusService extends TransactionBaseService implements IEventBusService {
  protected readonly container_: MedusaContainer & InjectedDependencies
  protected readonly config_: ConfigModule
  protected readonly logger_: Logger
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager | undefined

  constructor(
    container: MedusaContainer & InjectedDependencies,
    manager,
    config: ConfigModule
  ) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])
    
    this.container_ = container
    this.config_ = config
    this.logger_ = container.logger
    this.manager_ = manager
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @return this
   */
  subscribe(event: string | symbol, handler: EventHandler): this {
    this.logger_.info(
      `[${String(event)}] No event bus installed. Subscribe is unavailable.`
    )
    return this
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @return this
   */
  unsubscribe(event: string | symbol, subscriber: EventHandler): this {
    this.logger_.info(
      `[${String(event)}] No event bus installed. Unsubscribe is unavailable.`
    )
    return this
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @return this
   */
  protected registerCronHandler_(
    event: string | symbol,
    subscriber: EventHandler
  ): this {
    this.logger_.info(
      `[${String(event)}] No event bus installed. Cron jobs are unavailable.`
    )
    return this
  }

  /**
   * Calls all subscribers when an event occurs.
   * @param {string} eventName - the name of the event to be process.
   * @param data - the data to send to the subscriber.
   * @param options - options to add the job with
   * @return the job from our queue
   */
  async emit<T>(
    eventName: string,
    data: T,
    options: { delay?: number } = {}
  ): Promise<void> {
    this.logger_.info(
      `[${eventName}] No event bus installed. Emitting events has no effect.`
    )
  }

  /**
   * Registers a cron job.
   * @param eventName - the name of the event
   * @param data - the data to be sent with the event
   * @param cron - the cron pattern
   * @param handler - the handler to call on each cron job
   * @return void
   */
  createCronJob<T>(
    eventName: string,
    data: T,
    cron: string,
    handler: EventHandler
  ): void {
    this.logger_.info(
      `[${eventName}] No event bus installed. Cron jobs are unavailable.`
    )
  }
}
