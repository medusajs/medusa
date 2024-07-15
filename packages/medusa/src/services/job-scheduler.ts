import { BaseJobOptions, DefaultJobOptions, Job, Queue, Worker } from "bullmq"
import Redis from "ioredis"
import { ConfigModule, Logger } from "../types/global"
import { promiseAll } from "@medusajs/utils"

type InjectedDependencies = {
  logger: Logger
}

type ScheduledJobHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export type CreateJobOptions = DefaultJobOptions & {
  keepExisting?: boolean
}

export default class JobSchedulerService {
  protected readonly config_: ConfigModule
  protected readonly logger_: Logger
  protected readonly handlers_: Map<string | symbol, ScheduledJobHandler[]> =
    new Map()
  protected readonly queue_: Queue

  constructor(
    { logger }: InjectedDependencies,
    config: ConfigModule,
    singleton = true
  ) {
    this.config_ = config
    this.logger_ = logger

    const prefix = `${config?.projectConfig?.redis_prefix ?? ""}${
      this.constructor.name
    }`

    if (singleton && config?.projectConfig?.redis_url) {
      // Required config
      // See: https://github.com/OptimalBits/bull/blob/develop/CHANGELOG.md#breaking-changes
      const connection = new Redis(config.projectConfig.redis_url, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        ...(config.projectConfig.redis_options ?? {}),
      })

      this.queue_ = new Queue(`scheduled-jobs:queue`, {
        connection,
        prefix,
      })

      // Register scheduled job worker
      new Worker("scheduled-jobs:queue", this.scheduledJobsWorker, {
        connection,
        prefix,
      })
    }
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @return this
   */
  protected registerHandler(
    event: string | symbol,
    handler: ScheduledJobHandler
  ): void {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function")
    }

    const handlers = this.handlers_.get(event) ?? []
    this.handlers_.set(event, [...handlers, handler])
  }

  /**
   * Handles incoming scheduled jobs.
   * @param job The job object
   * @return resolves to the results of the subscriber calls.
   */
  protected scheduledJobsWorker = async <T>(job: {
    data: { eventName: string; data: T }
  }): Promise<unknown[]> => {
    const { eventName, data } = job.data
    const observers = this.handlers_.get(eventName) || []
    this.logger_.info(`Processing scheduled job: ${eventName}`)

    return await promiseAll(
      observers.map(async (subscriber) => {
        return subscriber(data, eventName).catch((err) => {
          this.logger_.warn(
            `An error occured while processing ${eventName}: ${err}`
          )
          return err
        })
      })
    )
  }

  /**
   * Registers a scheduled job.
   * @param eventName - the name of the event
   * @param data - the data to be sent with the event
   * @param schedule - the schedule expression
   * @param handler - the handler to call on the job
   * @param options - job options
   * @return added job
   */
  async create<T>(
    eventName: string,
    data: T,
    schedule: string,
    handler: ScheduledJobHandler,
    options: CreateJobOptions
  ): Promise<Job> {
    this.logger_.info(`Registering ${eventName}`)
    this.registerHandler(eventName, handler)

    const jobToCreate = {
      eventName,
      data,
    }

    const baseJobOptions: BaseJobOptions = {
      repeat: { pattern: schedule },
    }

    if (options?.keepExisting) {
      const { keepExisting, ...jobOptions } = options
      return await this.queue_.add(eventName, jobToCreate, {
        ...baseJobOptions,
        ...jobOptions,
      })
    }

    const existingJobs = (await this.queue_.getRepeatableJobs()) ?? []

    const existingJob = existingJobs.find((job) => job.name === eventName)

    if (existingJob) {
      await this.queue_.removeRepeatableByKey(existingJob.key)
    }

    return await this.queue_.add(eventName, jobToCreate, {
      ...baseJobOptions,
      ...options,
    })
  }
}
