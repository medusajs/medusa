import {
  Event,
  // TODO: Comment temporarely and we will re enable it in the near future #14478
  // EventBusEventsOptions,
  InternalModuleDeclaration,
  Logger,
  Message,
} from "@medusajs/framework/types"
import {
  AbstractEventBusModuleService,
  EventPriority,
  isPresent,
  promiseAll,
} from "@medusajs/framework/utils"
import {
  BulkJobOptions,
  Queue,
  QueueOptions,
  Worker,
  WorkerOptions,
} from "bullmq"
import { Redis } from "ioredis"
import {
  BullJob,
  EmitOptions,
  EventBusRedisModuleOptions,
  Options,
} from "../types"

type InjectedDependencies = {
  logger: Logger
  eventBusRedisConnection: Redis
  eventBusRedisQueueName: string
  eventBusRedisQueueOptions: Omit<QueueOptions, "connection">
  eventBusRedisWorkerOptions: Omit<WorkerOptions, "connection">
  eventBusRedisJobOptions: EmitOptions
}

type IORedisEventType<T = unknown> = {
  name: string
  data: Omit<Event<T>, "name"> // See comment in `buildEvents` method
  opts: BulkJobOptions
}

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
// eslint-disable-next-line max-len
export default class RedisEventBusService extends AbstractEventBusModuleService {
  protected readonly logger_: Logger
  protected readonly eventBusRedisConnection_: Redis

  protected readonly queueName_: string
  protected readonly queueOptions_: Omit<QueueOptions, "connection">
  protected readonly workerOptions_: Omit<WorkerOptions, "connection">
  protected readonly jobOptions_: EmitOptions
  // TODO: Comment temporarely and we will re enable it in the near future #14478
  // private readonly eventOptions_: EventBusEventsOptions

  protected queue_: Queue
  protected bullWorker_: Worker

  constructor(
    {
      logger,
      eventBusRedisConnection,
      eventBusRedisQueueName,
      eventBusRedisQueueOptions,
      eventBusRedisWorkerOptions,
      eventBusRedisJobOptions,
    }: InjectedDependencies,
    _moduleOptions: EventBusRedisModuleOptions = {},
    _moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.eventBusRedisConnection_ = eventBusRedisConnection
    this.logger_ = logger

    this.queueName_ = eventBusRedisQueueName ?? "events-queue"
    this.queueOptions_ = eventBusRedisQueueOptions ?? {}
    this.workerOptions_ = eventBusRedisWorkerOptions ?? {}
    this.jobOptions_ = eventBusRedisJobOptions ?? {}
    // TODO: Comment temporarely and we will re enable it in the near future #14478
    // this.eventOptions_ =
    //   _moduleOptions.eventOptions ??
    //   _moduleDeclaration.options?.eventOptions ??
    //   {}

    this.queue_ = new Queue(this.queueName_, {
      prefix: `${this.constructor.name}`,
      ...this.queueOptions_,
      connection: eventBusRedisConnection,
    })

    // Register our worker to handle emit calls
    if (this.isWorkerMode) {
      this.bullWorker_ = new Worker(this.queueName_, this.worker_, {
        prefix: `${this.constructor.name}`,
        ...this.workerOptions_,
        connection: eventBusRedisConnection,
        autorun: false,
      })
    }
  }

  __hooks = {
    onApplicationStart: async () => {
      await this.bullWorker_?.run()
    },
    onApplicationShutdown: async () => {
      await this.queue_.close()
      // eslint-disable-next-line max-len
      this.eventBusRedisConnection_.disconnect()
    },
    onApplicationPrepareShutdown: async () => {
      await this.bullWorker_?.close()
    },
  }

  /**
   * Build events for queue processing with priority handling.
   *
   * Priority levels (lower number = higher priority):
   * - 10: Critical business events (e.g., order placed)
   * - 100: Default priority for normal events (default)
   * - 2,097,152: Lowest priority for internal events
   *
   * Priority override hierarchy (highest to lowest precedence):
   * 1. Message-level options (eventData.options.priority)
   * 2. Emit-level options (options.priority)
   * 3. Module-level job options (this.jobOptions_.priority)
   * 4. Internal flag default (options.internal ? EventPriority.LOWEST : EventPriority.DEFAULT)
   */
  private buildEvents<T>(
    eventsData: Message<T>[],
    options: Options = {}
  ): IORedisEventType<T>[] {
    const opts = {
      // default options
      removeOnComplete: true,
      attempts: 1,
      priority: options.internal ? EventPriority.LOWEST : EventPriority.DEFAULT,
      // global options
      ...this.jobOptions_,
      ...options,
    }

    return eventsData.map((eventData) => {
      // We want to preserve event data + metadata. However, bullmq only allows for a single data field.
      // Therefore, upon adding jobs to the queue we will serialize the event data and metadata into a single field
      // and upon processing the job, we will deserialize it back into the original format expected by the subscribers.
      const event = {
        data: eventData.data,
        metadata: eventData.metadata,
      }

      const finalOptions: IORedisEventType<T>["opts"] = {
        ...opts,
        ...eventData.options,
      }

      // TODO: Comment temporarely and we will re enable it in the near future #14478
      // finalOptions.priority =
      //   eventData.options?.priority ??
      //   this.eventOptions_[eventData.name]?.priority

      if (
        finalOptions.priority != undefined &&
        (finalOptions.priority < 1 ||
          finalOptions.priority > EventPriority.LOWEST)
      ) {
        this.logger_.warn(
          `Invalid priority value: ${finalOptions.priority} for event ${eventData.name}. Must be between 1 and ${EventPriority.LOWEST}`
        )
        finalOptions.priority = EventPriority.DEFAULT
        this.logger_.warn(
          `Setting priority to default value: ${EventPriority.DEFAULT} for event ${eventData.name}`
        )
      }

      return {
        data: event,
        name: eventData.name,
        opts: finalOptions,
      } as IORedisEventType<T>
    })
  }

  /**
   * Emit a single or number of events
   * @param eventsData
   * @param options
   */
  async emit<T = unknown>(
    eventsData: Message<T> | Message<T>[],
    options: Options = {}
  ): Promise<void> {
    let eventsDataArray = Array.isArray(eventsData) ? eventsData : [eventsData]

    const { groupedEventsTTL = 600 } = options
    delete options.groupedEventsTTL

    const eventsToEmit = eventsDataArray.filter(
      (eventData) => !isPresent(eventData.metadata?.eventGroupId)
    )

    const eventsToGroup = eventsDataArray.filter((eventData) =>
      isPresent(eventData.metadata?.eventGroupId)
    )

    const groupEventsMap = new Map<string, Message<T>[]>()

    for (const event of eventsToGroup) {
      const groupId = event.metadata?.eventGroupId!
      const groupEvents = groupEventsMap.get(groupId) ?? []

      groupEvents.push(event)
      groupEventsMap.set(groupId, groupEvents)
    }

    const promises: Promise<unknown>[] = []

    if (eventsToEmit.length) {
      eventsToEmit.map((eventData) =>
        this.callInterceptors(eventData, { isGrouped: false })
      )

      const eventsWithSubscribers = eventsToEmit.filter((eventData) => {
        const eventSubscribers =
          this.eventToSubscribersMap.get(eventData.name) || []
        const wildcardSubscribers = this.eventToSubscribersMap.get("*") || []
        return eventSubscribers.length || wildcardSubscribers.length
      })

      if (eventsWithSubscribers.length) {
        const emitData = this.buildEvents(eventsWithSubscribers, options)
        promises.push(this.queue_.addBulk(emitData))
      }
    }

    for (const [groupId, events] of groupEventsMap.entries()) {
      if (!events?.length) {
        continue
      }

      // Set a TTL for the key of the list that is scoped to a group
      // This will be helpful in preventing stale data from staying in redis for too long
      // in the event the module fails to cleanup events. For long running workflows, setting a much higher
      // TTL or even skipping the TTL would be required
      void this.setExpire(groupId, groupedEventsTTL)

      const eventsData = this.buildEvents(events, options)

      promises.push(this.groupEvents(groupId, eventsData))
    }

    await promiseAll(promises)
  }

  private async setExpire(eventGroupId: string, ttl: number) {
    if (!eventGroupId) {
      return
    }

    await this.eventBusRedisConnection_.expire(`staging:${eventGroupId}`, ttl)
  }

  private async groupEvents<T = unknown>(
    eventGroupId: string,
    events: IORedisEventType<T>[]
  ) {
    await this.eventBusRedisConnection_.rpush(
      `staging:${eventGroupId}`,
      ...events.map((event) => JSON.stringify(event))
    )
  }

  private async getGroupedEvents(
    eventGroupId: string
  ): Promise<IORedisEventType[]> {
    return await this.eventBusRedisConnection_
      .lrange(`staging:${eventGroupId}`, 0, -1)
      .then((result) => {
        return result.map((jsonString) => JSON.parse(jsonString))
      })
  }

  async releaseGroupedEvents(eventGroupId: string) {
    const groupedEvents = await this.getGroupedEvents(eventGroupId)

    // Call interceptors before emitting grouped events
    // Extract the original messages from the job data structure
    groupedEvents.map((jobData) => {
      const message = {
        name: jobData.name,
        data: jobData.data,
        metadata: jobData.data.metadata,
      }
      this.callInterceptors(message as any, {
        isGrouped: true,
        eventGroupId,
      })
    })

    const eventsWithSubscribers = groupedEvents.filter((jobData) => {
      const eventSubscribers =
        this.eventToSubscribersMap.get(jobData.name) || []
      const wildcardSubscribers = this.eventToSubscribersMap.get("*") || []
      return eventSubscribers.length || wildcardSubscribers.length
    })

    if (eventsWithSubscribers.length) {
      await this.queue_.addBulk(eventsWithSubscribers)
    }

    await this.clearGroupedEvents(eventGroupId)
  }

  async clearGroupedEvents(
    eventGroupId: string,
    {
      eventNames,
    }: {
      eventNames?: string[]
    } = {}
  ) {
    if (!eventGroupId) {
      return
    }

    if (eventNames?.length) {
      /**
       * If any event names are provided, we keep all events except the ones that match the event
       * names. which allow to partially clear an event group.
       */

      const eventsToKeep = await this.eventBusRedisConnection_
        .lrange(`staging:${eventGroupId}`, 0, -1)
        .then((result) => {
          return result
            .map((jsonString) => JSON.parse(jsonString))
            .filter((event) => !eventNames.includes(event.name))
        })

      // Create a pipeline
      const pipeline = this.eventBusRedisConnection_.pipeline()

      // Empty the current list
      pipeline.del(`staging:${eventGroupId}`)

      // Add the remaining events to the list
      pipeline.rpush(
        `staging:${eventGroupId}`,
        ...eventsToKeep.map((event) => JSON.stringify(event))
      )

      await pipeline.exec()

      return
    }

    await this.eventBusRedisConnection_.unlink(`staging:${eventGroupId}`)
  }

  /**
   * Handles incoming jobs.
   * @param job The job object
   * @return resolves to the results of the subscriber calls.
   */
  worker_ = async <T>(job: BullJob<T>): Promise<unknown> => {
    const { data, name, opts } = job
    const eventSubscribers = this.eventToSubscribersMap.get(name) || []
    const wildcardSubscribers = this.eventToSubscribersMap.get("*") || []

    const allSubscribers = eventSubscribers.concat(wildcardSubscribers)

    // Pull already completed subscribers from the job data
    const completedSubscribers = job.data.completedSubscriberIds || []

    // Filter out already completed subscribers from the all subscribers
    const subscribersInCurrentAttempt = allSubscribers.filter(
      (subscriber) =>
        subscriber.id && !completedSubscribers.includes(subscriber.id)
    )

    const currentAttempt = job.attemptsMade
    const isRetry = currentAttempt > 1
    const configuredAttempts = job.opts.attempts

    const isFinalAttempt = currentAttempt === configuredAttempts

    if (!opts.internal) {
      if (isRetry) {
        if (isFinalAttempt) {
          this.logger_.info(`Final retry attempt for ${name}`)
        }

        this.logger_.info(
          `Retrying ${name} which has ${eventSubscribers.length} subscribers (${subscribersInCurrentAttempt.length} of them failed)`
        )
      } else {
        const prioirityInfo =
          opts.priority != undefined ? ` (priority: ${opts.priority})` : ""
        this.logger_.info(
          `Processing ${name}${prioirityInfo} which has ${eventSubscribers.length} subscribers`
        )
      }
    }

    const completedSubscribersInCurrentAttempt: string[] = []

    const subscribersResult = await Promise.all(
      subscribersInCurrentAttempt.map(async ({ id, subscriber }) => {
        // De-serialize the event data and metadata from a single field into the original format expected by the subscribers
        const event = {
          name,
          data: data.data,
          metadata: data.metadata,
        }

        try {
          return await subscriber(event).then((data) => {
            // For every subscriber that completes successfully, add their id to the list of completed subscribers
            completedSubscribersInCurrentAttempt.push(id)
            return data
          })
        } catch (err) {
          this.logger_?.warn(`An error occurred while processing ${name}:`)
          this.logger_?.warn(err)

          return err
        }
      })
    )

    // If the number of completed subscribers is different from the number of subcribers to process in current attempt, some of them failed
    const didSubscribersFail =
      completedSubscribersInCurrentAttempt.length !==
      subscribersInCurrentAttempt.length

    const isRetriesConfigured = configuredAttempts! > 1

    // Therefore, if retrying is configured, we try again
    const shouldRetry =
      didSubscribersFail && isRetriesConfigured && !isFinalAttempt

    if (shouldRetry) {
      const updatedCompletedSubscribers = [
        ...completedSubscribers,
        ...completedSubscribersInCurrentAttempt,
      ]

      job.data.completedSubscriberIds = updatedCompletedSubscribers

      await job.updateData(job.data)

      const errorMessage = `One or more subscribers of ${name} failed. Retrying...`

      this.logger_.warn(errorMessage)

      throw Error(errorMessage)
    }

    if (didSubscribersFail && !isFinalAttempt) {
      // If retrying is not configured, we log a warning to allow server admins to recover manually
      this.logger_.warn(
        `One or more subscribers of ${name} failed. Retrying is not configured. Use 'attempts' option when emitting events.`
      )
    }

    return subscribersResult
  }
}
