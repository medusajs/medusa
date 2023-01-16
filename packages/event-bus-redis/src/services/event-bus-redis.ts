import {
  ConfigModule,
  ConfigurableModuleDeclaration,
  IEventBusService,
  Logger,
  MedusaContainer,
  MODULE_RESOURCE_TYPE,
  StagedJob,
  StagedJobService,
  TransactionBaseService,
} from "@medusajs/medusa"
import { Job, Queue, Worker } from "bullmq"
import Redis from "ioredis"
import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { ulid } from "ulid"
import { sleep } from "../utils/sleep"

type InjectedDependencies = {
  manager: EntityManager
  logger: Logger
  stagedJobService: StagedJobService
}

type Subscriber<T = unknown> = (data: T, eventName: string) => Promise<void>

type SubscriberContext = {
  subscriberId: string
}

type BullJob<T> = {
  data: {
    eventName: string
    data: T
    completedSubscriberIds: string[] | undefined
  }
} & Job

type SubscriberDescriptor = {
  id: string
  subscriber: Subscriber
}

type EmitOptions = {
  delay?: number
  attempts: number
  backoff?: {
    type: "fixed" | "exponential"
    delay: number
  }
}

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
export default class RedisEventBusService
  extends TransactionBaseService
  implements IEventBusService
{
  protected readonly config_: ConfigModule
  protected readonly logger_: Logger
  protected readonly stagedJobService_: StagedJobService
  protected readonly eventToSubscribersMap_: Map<
    string | symbol,
    SubscriberDescriptor[]
  > = new Map()

  protected queue_: Queue
  protected shouldEnqueuerRun: boolean
  protected enqueue_: Promise<void>

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor(
    {
      manager,
      logger,
      stagedJobService,
    }: MedusaContainer & InjectedDependencies,
    config: ConfigModule,
    moduleDeclaration?: ConfigurableModuleDeclaration,
    singleton = true
  ) {
    // @ts-ignore
    super(...arguments)

    if (moduleDeclaration?.resources !== MODULE_RESOURCE_TYPE.SHARED) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "At the moment this module can only be used with shared resources"
      )
    }

    this.config_ = config
    this.manager_ = manager

    this.logger_ = logger
    this.stagedJobService_ = stagedJobService

    if (singleton && config?.projectConfig?.redis_url) {
      this.connect()
    }
  }

  connect(): void {
    const connection = new Redis(this.config_?.projectConfig?.redis_url!)

    this.queue_ = new Queue(`:events-queue`, {
      connection,
      prefix: `${this.constructor.name}`,
    })

    // Register our worker to handle emit calls
    new Worker("events-worker", this.worker_, {
      connection,
      prefix: `${this.constructor.name}`,
    })

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
  subscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this {
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function")
    }

    /**
     * If context is provided, we use the subscriberId from it
     * otherwise we generate a random using a ulid
     */
    const subscriberId =
      context?.subscriberId ?? `${event.toString()}-${ulid()}`

    const newSubscriberDescriptor = { subscriber, id: subscriberId }

    const existingSubscribers = this.eventToSubscribersMap_.get(event) ?? []

    const subscriberAlreadyExists = existingSubscribers.find(
      (sub) => sub.id === subscriberId
    )

    if (subscriberAlreadyExists) {
      throw Error(`Subscriber with id ${subscriberId} already exists`)
    }

    this.eventToSubscribersMap_.set(event, [
      ...existingSubscribers,
      newSubscriberDescriptor,
    ])

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

    const existingSubscribers = this.eventToSubscribersMap_.get(event)

    if (existingSubscribers?.length) {
      const subIndex = existingSubscribers?.findIndex(
        (sub) => sub.subscriber === subscriber
      )

      if (subIndex !== -1) {
        this.eventToSubscribersMap_.get(event)?.splice(subIndex as number, 1)
      }
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
    options: Record<string, unknown> & EmitOptions = { attempts: 1 }
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
      const jobToCreate = {
        event_name: eventName,
        data: data as unknown as Record<string, unknown>,
        options: opts,
      } as Partial<StagedJob>

      return await this.stagedJobService_
        .withTransaction(this.transactionManager_)
        .create(jobToCreate)
    }

    this.queue_.add(eventName, { eventName, data }, opts)
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
              job.event_name,
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

    const isRetriesConfigured = job?.opts?.attempts! > 1

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
}
