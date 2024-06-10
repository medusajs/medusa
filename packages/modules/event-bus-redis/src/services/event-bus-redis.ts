import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import { Logger, Message, MessageBody } from "@medusajs/types"
import {
  AbstractEventBusModuleService,
  isPresent,
  promiseAll,
} from "@medusajs/utils"
import { BulkJobOptions, Queue, Worker } from "bullmq"
import { Redis } from "ioredis"
import { BullJob, EventBusRedisModuleOptions } from "../types"

type InjectedDependencies = {
  logger: Logger
  eventBusRedisConnection: Redis
}

type IORedisEventType<T = unknown> = {
  name: string
  data: MessageBody<T>
  opts: BulkJobOptions
}

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
// eslint-disable-next-line max-len
export default class RedisEventBusService extends AbstractEventBusModuleService {
  protected readonly logger_: Logger
  protected readonly moduleOptions_: EventBusRedisModuleOptions
  // eslint-disable-next-line max-len
  protected readonly moduleDeclaration_: InternalModuleDeclaration
  protected readonly eventBusRedisConnection_: Redis

  protected queue_: Queue
  protected bullWorker_: Worker

  constructor(
    { logger, eventBusRedisConnection }: InjectedDependencies,
    moduleOptions: EventBusRedisModuleOptions = {},
    moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.eventBusRedisConnection_ = eventBusRedisConnection

    this.moduleOptions_ = moduleOptions
    this.logger_ = logger

    this.queue_ = new Queue(moduleOptions.queueName ?? `events-queue`, {
      prefix: `${this.constructor.name}`,
      ...(moduleOptions.queueOptions ?? {}),
      connection: eventBusRedisConnection,
    })

    // Register our worker to handle emit calls
    const shouldStartWorker = moduleDeclaration.worker_mode !== "server"
    if (shouldStartWorker) {
      this.bullWorker_ = new Worker(
        moduleOptions.queueName ?? "events-queue",
        this.worker_,
        {
          prefix: `${this.constructor.name}`,
          ...(moduleOptions.workerOptions ?? {}),
          connection: eventBusRedisConnection,
        }
      )
    }
  }

  __hooks = {
    onApplicationShutdown: async () => {
      await this.queue_.close()
      // eslint-disable-next-line max-len
      this.eventBusRedisConnection_.disconnect()
    },
    onApplicationPrepareShutdown: async () => {
      await this.bullWorker_?.close()
    },
  }

  private buildEvents<T>(
    eventsData: Message<T>[],
    options: BulkJobOptions = {}
  ): IORedisEventType<T>[] {
    const opts = {
      // default options
      removeOnComplete: true,
      attempts: 1,
      // global options
      ...(this.moduleOptions_.jobOptions ?? {}),
      ...options,
    }

    return eventsData.map((eventData) => {
      const { options, ...eventBody } = eventData

      return {
        name: eventData.eventName,
        data: eventBody,
        opts: {
          // options for event group
          ...opts,
          // options for a particular event
          ...options,
        },
      }
    })
  }

  /**
   * Emit a single or number of events
   * @param {Message} data - the data to send to the subscriber.
   * @param {BulkJobOptions} data - the options to add to bull mq
   */
  async emit<T = unknown>(
    eventsData: Message<T> | Message<T>[],
    options: BulkJobOptions = {}
  ): Promise<void> {
    let eventsDataArray = Array.isArray(eventsData) ? eventsData : [eventsData]

    const eventsToEmit = eventsDataArray.filter(
      (eventData) => !isPresent(eventData.metadata?.eventGroupId)
    )

    const eventsToGroup = eventsDataArray.filter((eventData) =>
      isPresent(eventData.metadata?.eventGroupId)
    )

    const groupEventsMap = new Map<string, Message<T>[]>()

    for (const event of eventsToGroup) {
      const groupId = event.metadata?.eventGroupId!
      const array = groupEventsMap.get(groupId) ?? []

      array.push(event)
      groupEventsMap.set(groupId, array)
    }

    const promises: Promise<unknown>[] = []

    if (eventsToEmit.length) {
      const emitData = this.buildEvents(eventsToEmit, options)

      promises.push(this.queue_.addBulk(emitData))
    }

    for (const [groupId, events] of groupEventsMap.entries()) {
      if (!events?.length) {
        continue
      }

      const eventsData = this.buildEvents(events, options)

      promises.push(this.groupEvents(groupId, eventsData))
    }

    await promiseAll(promises)
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

  private async getGroupedEvents(eventGroupId: string) {
    return await this.eventBusRedisConnection_
      .lrange(`staging:${eventGroupId}`, 0, -1)
      .then((result) => {
        return result.map((jsonString) => JSON.parse(jsonString))
      })
  }

  async releaseGroupedEvents(eventGroupId: string) {
    const groupedEvents: IORedisEventType[] = await this.getGroupedEvents(
      eventGroupId
    )

    await this.queue_.addBulk(groupedEvents)

    await this.clearGroupedEvents(eventGroupId)
  }

  async clearGroupedEvents(eventGroupId: string) {
    if (!eventGroupId) {
      return
    }
    await this.eventBusRedisConnection_.del(`staging:${eventGroupId}`)
  }

  /**
   * Handles incoming jobs.
   * @param job The job object
   * @return resolves to the results of the subscriber calls.
   */
  worker_ = async <T>(job: BullJob<T>): Promise<unknown> => {
    const { eventName, data } = job.data
    const eventSubscribers = this.eventToSubscribersMap.get(eventName) || []
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
        return await subscriber(data, eventName)
          .then(async (data) => {
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
