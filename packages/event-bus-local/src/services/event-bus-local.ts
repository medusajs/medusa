import {
  AbstractEventBusModuleService,
  Logger,
  MedusaContainer,
  Subscriber
} from "@medusajs/medusa"
import { EventEmitter } from "events"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  logger: Logger
}

const eventEmitter = new EventEmitter()

export default class LocalEventBusService extends AbstractEventBusModuleService {
  protected readonly container_: MedusaContainer & InjectedDependencies
  protected readonly logger_: Logger
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager | undefined

  constructor({ logger }: MedusaContainer & InjectedDependencies) {
    // @ts-ignore
    super(...arguments)

    this.logger_ = logger
  }

  withTransaction(transactionManager?: EntityManager) {
    return this
  }

  async emit<T>(eventName: string, data: T): Promise<void> {
    const eventListenersCount = eventEmitter.listenerCount(eventName)

    if (eventListenersCount === 0) {
      return
    }

    this.logger_.info(
      `Processing ${eventName} which has ${eventListenersCount} subscribers`
    )

    eventEmitter.emit(eventName, data)
  }

  subscribe(event: string | symbol, subscriber: Subscriber): this {
    eventEmitter.on(event, subscriber)
    return this
  }

  unsubscribe(event: string | symbol, subscriber: Subscriber): this {
    eventEmitter.off(event, subscriber)
    return this
  }
}
