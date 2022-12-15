import {
  AbstractBackgroundJobService, Logger,
  MedusaContainer
} from "@medusajs/medusa"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  logger: Logger
}

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
export default class LocalBackgroundJobService
  extends AbstractBackgroundJobService
{
  protected readonly container_: MedusaContainer & InjectedDependencies
  protected readonly logger_: Logger
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager | undefined

  constructor(container, manager) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.logger_ = container.logger
  }

  /**
   * @return this
   */
  protected registerBackgroundJobHandler_(
    event: string | symbol,
  ): this {
    this.logger_.info(
      `[${event.toString()}] Local Background Job module installed. Cron jobs are unavailable.`
    )
    return this
  }

  /**
   * @return void
   */
  createBackgroundJob<T>(
    eventName: string,
  ): void {
    this.logger_.info(
      `[${eventName}] Local Background Job module installed. Cron jobs are unavailable.`
    )
  }
}
