import {
  ConfigModule,
  EventHandler,
  IEventBusService,
  Logger,
  MedusaContainer,
  StagedJob,
  StagedJobService,
  TransactionBaseService
} from "@medusajs/medusa"
import Bull from "bull"
import Redis from "ioredis"
import { isDefined } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { sleep } from "../utils/sleep"

type InjectedDependencies = {
  manager: EntityManager
  logger: Logger
  stagedJobService: StagedJobService
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
export default class RedisEventBusService extends TransactionBaseService implements IEventBusService {
  protected readonly container_: MedusaContainer & InjectedDependencies
  protected readonly config_: ConfigModule
  protected readonly manager_: EntityManager
  protected readonly logger_: Logger
  protected readonly stagedJobService_: StagedJobService

  protected observers_: Map<string | symbol, EventHandler[]>
  protected cronHandlers_: Map<string | symbol, EventHandler[]>
  protected redisClient_: Redis.Redis
  protected redisSubscriber_: Redis.Redis
  protected cronQueue_: Bull
  protected queue_: Bull
  protected shouldEnqueuerRun: boolean
  protected transactionManager_: EntityManager | undefined
  protected enqueue_: Promise<void>

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
    this.stagedJobService_ = container.stagedJobService

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

    this.observers_ = new Map()
    this.queue_ = new Bull(
      `${this.constructor.name}:queue`,
      this.reuseConnections(client, subscriber, config)
    )
    this.cronHandlers_ = new Map()
    this.redisClient_ = client
    this.redisSubscriber_ = subscriber
    this.cronQueue_ = new Bull(
      `cron-jobs:queue`,
      this.reuseConnections(client, subscriber, config)
    )
    // Register our worker to handle emit calls
    this.queue_.process(this.worker_)
    // Register cron worker
    this.cronQueue_.process(this.cronWorker_)

    if (process.env.NODE_ENV !== "test") {
      this.startEnqueuer()
    }
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * @param context - context to use when attaching subscriber
   * happens. Subscribers must return a Promise.
   * @return this
   */
  subscribe(event: string | symbol, handler: EventHandler): this {
    if (typeof handler !== "function") {
      throw new Error("Subscriber must be a function")
    }

    const observers = this.observers_.get(event) ?? []
    this.observers_.set(event, [...observers, handler])

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
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function")
    }

    const existingSubscribers = this.eventToSubscribersMap_.get(event)

    if (existingSubscribers?.length) {
      const subIndex = existingSubscribers?.findIndex(
        (sub) => sub.subscriber === subscriber
      )

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
    if (typeof subscriber !== "function") {
      throw new Error("Handler must be a function")
    }

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
  ): Promise<StagedJob | void> {
    const opts: { removeOnComplete: boolean } & EmitOptions = {
      removeOnComplete: true,
      attempts: 1,
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

    /**
     * If we are in an ongoing transaction, we store the jobs in the database
     * instead of processing them immediately. We only want to process those
     * events, if the transaction successfully commits. This is to avoid jobs
     * being processed if the transaction fails.
     *
     * In case of a failing transaction, kobs stored in the database are removed
     * as part of the rollback.
     */
    if (this.transactionManager_) {
      return await this.stagedJobService_
        .withTransaction(this.transactionManager_)
        .create({
          event_name: eventName,
          data,
        } as StagedJob)
    } else {
      // should be replaced by a generic event bus
      const opts: { removeOnComplete: boolean; delay?: number } = {
        removeOnComplete: true,
      }
      if (typeof options.delay === "number") {
        opts.delay = options.delay
      }
      this.queue_.add({ eventName, data }, opts)
    }

    this.queue_.add({ eventName, data }, opts)
  }

  startEnqueuer(): void {
    this.shouldEnqueuerRun = true
    this.enqueue_ = this.enqueuer_()
  }

  async stopEnqueuer(): Promise<void> {
    this.shouldEnqueuerRun = false
    await this.enqueue_
  }

  async enqueuer_(): Promise<void> {
    while (this.shouldEnqueuerRun) {
      const listConfig = {
        relations: [],
        skip: 0,
        take: 1000,
      }

      const jobs = await this.stagedJobService_.list(listConfig)

      await Promise.all(
        jobs.map((job) => {
          this.queue_
            .add(
              { eventName: job.event_name, data: job.data },
              job.options ?? { removeOnComplete: true }
            )
            .then(async () => {
              await this.stagedJobService_.remove(job)
            })
        })
      )

      await sleep(3000)
    }
  }

  /**
   * Handles incoming jobs.
   * @param job The job object
   * @return resolves to the results of the subscriber calls.
   */
  worker_ = async <T>(job: BullJob<T>): Promise<unknown> => {
    const { eventName, data } = job.data
    const eventSubscribers = this.eventToSubscribersMap_.get(eventName) || []
    const wildcardSubscribers = this.eventToSubscribersMap_.get("*") || []

    const allSubscribers = eventSubscribers.concat(wildcardSubscribers)

    // Pull already completed subscribers from the job data
    const completedSubscribers = job.data.completedSubscriberIds || []

    // Filter out already completed subscribers from the all subscribers
    const subscribersInCurrentAttempt = allSubscribers.filter(
      (subscriber) =>
        subscriber.id && !completedSubscribers.includes(subscriber.id)
    )

    const isRetry = job.attemptsMade > 0
    const currentAttempt = job.attemptsMade + 1

    const isFinalAttempt = job?.opts?.attempts === currentAttempt

    if (isRetry) {
      if (isFinalAttempt) {
        this.logger_.info(`Final retry attempt for ${eventName}`)
      }

      this.logger_.info(
        `Retrying ${eventName} which has ${eventSubscribers.length} subscribers (${subscribersInCurrentAttempt.length} of them failed)`
      )
    } else {
      this.logger_.info(
        `Processing ${eventName} which has ${eventSubscribers.length} subscribers`
      )
    }

    const completedSubscribersInCurrentAttempt: string[] = []

    const subscribersResult = await Promise.all(
      subscribersInCurrentAttempt.map(async ({ id, subscriber }) => {
        return subscriber(data, eventName)
          .then((data) => {
            // For every subscriber that completes successfully, add their id to the list of completed subscribers
            completedSubscribersInCurrentAttempt.push(id)
            return data
          })
          .catch((err) => {
            this.logger_.warn(
              `An error occurred while processing ${eventName}: ${err}`
            )
            return err
          })
      })
    )

    // If the number of completed subscribers is different from the number of subcribers to process in current attempt, some of them failed
    const didSubscribersFail =
      completedSubscribersInCurrentAttempt.length !==
      subscribersInCurrentAttempt.length

    const isRetriesConfigured = job?.opts?.attempts > 1

    // Therefore, if retrying is configured, we try again
    const shouldRetry =
      didSubscribersFail && isRetriesConfigured && !isFinalAttempt

    if (shouldRetry) {
      const updatedCompletedSubscribers = [
        ...completedSubscribers,
        ...completedSubscribersInCurrentAttempt,
      ]

      job.data.completedSubscriberIds = updatedCompletedSubscribers

      job.update(job.data)

      const errorMessage = `One or more subscribers of ${eventName} failed. Retrying...`

      this.logger_.warn(errorMessage)

      return Promise.reject(Error(errorMessage))
    }

    if (didSubscribersFail && !isFinalAttempt) {
      // If retrying is not configured, we log a warning to allow server admins to recover manually
      this.logger_.warn(
        `One or more subscribers of ${eventName} failed. Retrying is not configured. Use 'attempts' option when emitting events.`
      )
    }

    return Promise.resolve(subscribersResult)
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
    handler: EventHandler
  ): void {
    this.jobSchedulerService_.create(eventName, data, cron, handler)
  }
}
