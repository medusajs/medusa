import Bull from "bull"
import Redis from "ioredis"
import { isDefined } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { ICacheService } from "../interfaces"
import { IEventBusService } from "../interfaces/services/event-bus"
import { ConfigModule, Logger } from "../types/global"
import JobSchedulerService from "./job-scheduler"

type InjectedDependencies = {
  manager: EntityManager
  logger: Logger
  jobSchedulerService: JobSchedulerService
  redisClient: Redis.Redis
  redisSubscriber: Redis.Redis
  cacheService: ICacheService
}

export type EventData<T = unknown> = {
  eventName: string
  data: T
  options?: EmitOptions
}

type Subscriber<T = unknown> = (data: T, eventName: string) => Promise<void>

type EmitOptions = {
  delay?: number
  attempts?: number
  backoff?: {
    type: "fixed" | "exponential"
    delay: number
  }
}

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
export default class EventBusService implements IEventBusService {
  protected readonly config_: ConfigModule
  protected readonly manager_: EntityManager
  protected readonly logger_: Logger
  protected readonly jobSchedulerService_: JobSchedulerService
  protected readonly observers_: Map<string | symbol, Subscriber[]>
  protected readonly redisClient_: Redis.Redis
  protected readonly redisSubscriber_: Redis.Redis
  protected readonly cacheService_: ICacheService
  protected queue_: Bull

  constructor(
    {
      manager,
      logger,
      redisClient,
      redisSubscriber,
      cacheService,
    }: InjectedDependencies,
    config: ConfigModule,
    singleton = true
  ) {
    this.config_ = config
    this.manager_ = manager
    this.logger_ = logger
    this.cacheService_ = cacheService

    if (singleton) {
      const opts = {
        createClient: (type: string): Redis.Redis => {
          switch (type) {
            case "client":
              return redisClient
            case "subscriber":
              return redisSubscriber
            default:
              if (config.projectConfig.redis_url) {
                return new Redis(config.projectConfig.redis_url)
              }
              return redisClient
          }
        },
      }

      this.observers_ = new Map()
      this.queue_ = new Bull(`${this.constructor.name}:queue`, opts)
      this.redisClient_ = redisClient
      this.redisSubscriber_ = redisSubscriber
      // Register our worker to handle emit calls
      this.queue_.process(this.worker_)
    }
  }

  withTransaction(transactionManager): this | EventBusService {
    if (!transactionManager) {
      return this
    }

    const cloned = new EventBusService(
      {
        manager: transactionManager,
        jobSchedulerService: this.jobSchedulerService_,
        logger: this.logger_,
        redisClient: this.redisClient_,
        redisSubscriber: this.redisSubscriber_,
        cacheService: this.cacheService_,
      },
      this.config_,
      false
    )

    cloned.queue_ = this.queue_

    return cloned
  }

  /**
   * Processes jobs in the queue.
   * @param job The job object
   * @return resolves to the results of the subscriber calls.
   */
  worker_ = async <T>(job: {
    data: { eventName: string; data: T }
  }): Promise<unknown[]> => {
    const { eventName, data } = job.data
    const eventObservers = this.observers_.get(eventName) || []
    const wildcardObservers = this.observers_.get("*") || []

    const observers = eventObservers.concat(wildcardObservers)

    this.logger_.info(
      `Processing ${eventName} which has ${eventObservers.length} subscribers`
    )

    return await Promise.all(
      observers.map(async (subscriber) => {
        return subscriber(data, eventName).catch((err) => {
          this.logger_.warn(
            `An error occurred while processing ${eventName}: ${err}`
          )
          console.error(err)
          return err
        })
      })
    )
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @return this
   */
  subscribe(event: string | symbol, subscriber: Subscriber): this {
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function")
    }

    const observers = this.observers_.get(event) ?? []
    this.observers_.set(event, [...observers, subscriber])

    return this
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @return this
   */
  unsubscribe(event: string | symbol, subscriber: Subscriber): this {
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function")
    }

    if (this.observers_.get(event)?.length) {
      const index = this.observers_.get(event)?.indexOf(subscriber)
      if (index !== -1) {
        this.observers_.get(event)?.splice(index as number, 1)
      }
    }

    return this
  }

  /**
   * Immediately add job to the queue or store in cache for later processing.
   * @param {string} eventName - the name of the event to be process.
   * @param data - the data to send to the subscriber.
   * @param options - options to add the job with
   * @return the job from our queue
   */
  async emit<T>(
    eventName: string,
    data: T,
    options: EmitOptions & { cacheKey?: string } = {}
  ): Promise<void> {
    // construct options for the job
    const opts: { removeOnComplete: boolean } & EmitOptions = {
      removeOnComplete: true,
    }
    if (typeof options.attempts === "number") {
      opts.attempts = options.attempts
      if (isDefined(options.backoff)) {
        opts.backoff = options.backoff
      }
    }
    if (typeof options.delay === "number") {
      opts.delay = options.delay
    }

    // If a unique id is passed to the method, we cache the event data
    // instead of processing it immediately. As a consumer, you should
    // process the events when appropriate e.g. when a transaction has
    // committed. Use method `processCachedEvents`.
    if (options?.cacheKey) {
      const cachedEvents =
        (await this.cacheService_.get<EventData[]>(options.cacheKey)) || []

      const job = { eventName, data, options: opts }
      const updateEvents = [...cachedEvents, job]

      await this.cacheService_.set(options.cacheKey, updateEvents)
    } else {
      this.queue_.add({ eventName, data }, opts)
    }
  }

  async processCachedEvents<T>(uniqueId: string, options: EmitOptions = {}) {
    const events = await this.cacheService_.get<EventData[]>(uniqueId)

    if (!events?.length) {
      return
    }

    await Promise.all(
      events.map((job) => {
        this.queue_.add(
          { eventName: job.eventName, data: job.data },
          job.options ?? options
        )
      })
    )
  }

  async destroyCachedEvents(cacheKey: string): Promise<void> {
    await this.cacheService_.invalidate(cacheKey)
  }

  /**
   * Registers a cron job.
   * @deprecated All cron job logic has been refactored to the `JobSchedulerService`. This method will be removed in a future release.
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
    handler: Subscriber
  ): void {
    this.jobSchedulerService_.create(eventName, data, cron, handler)
  }
}
