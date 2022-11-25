import { ConfigModule, EventHandler, IEventBusService, Logger, MedusaContainer, TransactionBaseService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  logger: Logger
}

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
   * @return this
   */
  subscribe(event: string | symbol, handler: EventHandler): this {
    this.logger_.info(
      `[${event.toString()}] No event bus installed. Subscribe is unavailable.`
    )
    return this
  }

  /**
   * @return this
   */
  unsubscribe(event: string | symbol, subscriber: EventHandler): this {
    this.logger_.info(
      `[${event.toString()}] No event bus installed. Unsubscribe is unavailable.`
    )
    return this
  }

  /**
   * @return this
   */
  protected registerCronHandler_(
    event: string | symbol,
    subscriber: EventHandler
  ): this {
    this.logger_.info(
      `[${event.toString()}] No event bus installed. Cron jobs are unavailable.`
    )
    return this
  }

  /**
   * @return void
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
