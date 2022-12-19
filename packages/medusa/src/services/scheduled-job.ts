import Bull from "bull"
import Redis from "ioredis"
import { ConfigModule, Logger } from "../types/global"

type InjectedDependencies = {
  logger: Logger
  redisClient: Redis.Redis
}

type ScheduledJobHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export default class ScheduledJobService {
  protected readonly config_: ConfigModule
  protected readonly logger_: Logger
  protected readonly handlers_: Map<string | symbol, ScheduledJobHandler[]>
  protected readonly redisClient_: Redis.Redis
  protected readonly queue_: Bull

  constructor(
    { logger, redisClient }: InjectedDependencies,
    config: ConfigModule,
    singleton = true
  ) {
    this.config_ = config
    this.logger_ = logger

    if (singleton) {
      const opts = {
        createClient: (type: string): Redis.Redis => {
          switch (type) {
            case "client":
              return redisClient
            default:
              if (config.projectConfig.redis_url) {
                return new Redis(config.projectConfig.redis_url)
              }
              return redisClient
          }
        },
      }

      this.handlers_ = new Map()
      this.redisClient_ = redisClient
      this.queue_ = new Bull(`scheduled-jobs:queue`, opts)
      // Register scheduled job worker
      this.queue_.process(this.scheduledJobsWorker)
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
  ): this {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function")
    }

    const handlers = this.handlers_.get(event) ?? []
    this.handlers_.set(event, [...handlers, handler])

    return this
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

    return await Promise.all(
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
   * @return void
   */
  create<T>(
    eventName: string,
    data: T,
    schedule: string,
    handler: ScheduledJobHandler
  ): void {
    this.logger_.info(`Registering ${eventName}`)
    this.registerHandler(eventName, handler)

    return this.queue_.add(
      {
        eventName,
        data,
      },
      { repeat: { cron: schedule } }
    )
  }
}
