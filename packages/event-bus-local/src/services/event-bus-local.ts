import {
  EventHandler,
  IEventBusService,
  Logger,
  MedusaContainer,
  TransactionBaseService,
} from "@medusajs/medusa"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  logger: Logger
}

export default class LocalEventBus
  extends TransactionBaseService
  implements IEventBusService
{
  protected readonly container_: MedusaContainer & InjectedDependencies
  protected readonly logger_: Logger
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager | undefined

  constructor(container: MedusaContainer & InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.logger_ = container.logger
  }

  /**
   * @return this
   */
  subscribe(event: string | symbol, handler: EventHandler): this {
    this.logger_.info(
      `[${event.toString()}] Local Event Bus installed. Subscribe is unavailable.`
    )
    return this
  }

  /**
   * @return this
   */
  unsubscribe(event: string | symbol, subscriber: EventHandler): this {
    this.logger_.info(
      `[${event.toString()}] Local Event Bus installed. Unsubscribe is unavailable.`
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
      `[${eventName}] Local Event Bus installed. Emitting events has no effect.`
    )
  }
}
