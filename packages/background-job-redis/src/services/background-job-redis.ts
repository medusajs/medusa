import {
  AbstractBackgroundJobService, BackgroundJobHandler, ConfigModule, Logger,
  MedusaContainer
} from "@medusajs/medusa"
import Bull from "bull"
import Redis from "ioredis"
import { EntityManager } from "typeorm"
import { AddJobOptions } from "../types"

type InjectedDependencies = {
  manager: EntityManager
  logger: Logger
  redisClient: Redis.Redis
  redisSubscriber: Redis.Redis
}

type RedisCreateConnectionOptions = {
  client: Redis.Redis
  subscriber: Redis.Redis
}

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
export default class RedisBackgroundJobService extends AbstractBackgroundJobService {
  protected readonly container_: MedusaContainer & InjectedDependencies
  protected readonly config_: ConfigModule
  protected readonly manager_: EntityManager
  protected readonly logger_: Logger

  protected handlers_: Map<string | symbol, BackgroundJobHandler[]>
  protected redisClient_: Redis.Redis
  protected redisSubscriber_: Redis.Redis
  protected queue_: Bull
  protected transactionManager_: EntityManager | undefined

  constructor(
    container: MedusaContainer & InjectedDependencies,
    config: ConfigModule,
    singleton = true
  ) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])
    
    this.container_ = container
    this.config_ = config
    this.manager_ = container.manager
    this.logger_ = container.logger

    if (singleton) {
      this.connect({
        client: container.redisClient,
        subscriber: container.redisSubscriber,
      }, config)
    }
  }

  // To be economical about the use of Redis connections, we reuse existing connection whenever possible
  // https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md#reusing-redis-connections
  private reuseConnections(
    client: Redis.Redis,
    subscriber: Redis.Redis,
    config: ConfigModule
  ): { createClient: (type: string) => Redis.Redis } {
    return {
      createClient: (type: string): Redis.Redis => {
        switch (type) {
          case "client":
            return client
          case "subscriber":
            return subscriber
          default:
            if (config?.projectConfig?.redis_url) {
              return new Redis(this.config_.projectConfig.redis_url)
            }
            return client
        }
      },
    }
  }

  connect(options: RedisCreateConnectionOptions, config: ConfigModule): void {
    const { client, subscriber } = options

    this.handlers_ = new Map()

    this.redisClient_ = client
    this.redisSubscriber_ = subscriber
    
    this.queue_ = new Bull(
      `background-jobs:queue`,
      this.reuseConnections(client, subscriber, config)
    )
    // Register background job worker
    this.queue_.process(this.worker_)
  }

  /**
   * Adds a function to a list of background job handler.
   * @param event - the event that the handler will listen for.
   * @param handler - the function to be called when a certain event
   * happens. Handlers must return a Promise.
   * @return this
   */
  protected registerCronHandler_(
    event: string | symbol,
    handler: BackgroundJobHandler
  ): this {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function")
    }

    const cronHandlers = this.handlers_.get(event) ?? []
    this.handlers_.set(event, [...cronHandlers, handler])

    return this
  }

  /**
   * Handles incoming background jobs
   * @param job The job object
   * @return resolves to the results of the handler calls.
   */
  worker_ = async <T>(job: {
    data: { eventName: string; data: T }
  }): Promise<unknown[]> => {
    const { eventName, data } = job.data
    const observers = this.handlers_.get(eventName) || []
    this.logger_.info(`Processing background job: ${eventName}`)

    return await Promise.all(
      observers.map(async (handler) => {
        return handler(data, eventName).catch((err) => {
          this.logger_.warn(
            `An error occured while processing ${eventName}: ${err}`
          )
          return err
        })
      })
    )
  }

  /**
   * Registers a background job.
   * @param eventName - the name of the event
   * @param data - the data to be sent with the event
   * @param options - the queue options
   * @param handler - the handler to call on each background job
   * @return void
   */
  create<T>(
    eventName: string,
    data: T,
    options: AddJobOptions,
    handler: BackgroundJobHandler
  ): void {
    this.logger_.info(`Registering ${eventName}`)
    this.registerCronHandler_(eventName, handler)
    return this.queue_.add(
      {
        eventName,
        data,
      },
      options
    )
  }
}
