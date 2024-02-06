import { EmitData, EventBusTypes, Logger, Message } from "@medusajs/types"
import { DatabaseErrorCode, EventBusUtils } from "@medusajs/utils"
import { EOL } from "os"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { StagedJob } from "../models"
import { FindConfig } from "../types/common"
import { ConfigModule } from "../types/global"
import { isString } from "../utils"
import { sleep } from "../utils/sleep"
import StagedJobService from "./staged-job"

type InjectedDependencies = {
  stagedJobService: StagedJobService
  eventBusModuleService: EventBusUtils.AbstractEventBusModuleService
  logger: Logger
}

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 */
export default class EventBusService
  extends TransactionBaseService
  implements EventBusTypes.IEventBusService
{
  protected readonly config_: ConfigModule
  protected readonly stagedJobService_: StagedJobService
  // eslint-disable-next-line max-len
  protected get eventBusModuleService_(): EventBusTypes.IEventBusModuleService {
    return this.__container__.eventBusModuleService
  }

  protected readonly logger_: Logger

  protected shouldEnqueuerRun: boolean
  protected enqueue_: Promise<void>

  constructor(
    { stagedJobService, logger }: InjectedDependencies,
    config: ConfigModule,
    isSingleton = true
  ) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.logger_ = logger
    this.config_ = config
    this.stagedJobService_ = stagedJobService

    if (process.env.NODE_ENV !== "test" && isSingleton) {
      this.startEnqueuer()
    }
  }

  withTransaction(transactionManager?: EntityManager): this {
    if (!transactionManager) {
      return this
    }

    const cloned = new (this.constructor as any)(
      {
        manager: transactionManager,
        stagedJobService: this.stagedJobService_,
        eventBusModuleService: this.eventBusModuleService_,
      },
      this.config_,
      false
    )

    cloned.manager_ = transactionManager
    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param event - the event that the subscriber will listen for.
   * @param subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   * @param context - subscriber context
   * @return this
   */
  subscribe(
    event: string | symbol,
    subscriber: EventBusTypes.Subscriber,
    context?: EventBusTypes.SubscriberContext
  ): this {
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function")
    }

    this.eventBusModuleService_.subscribe(event, subscriber, context)
    return this
  }

  /**
   * Removes function from the list of event subscribers.
   * @param event - the event of the subcriber.
   * @param subscriber - the function to be removed
   * @param context - subscriber context
   * @return this
   */
  unsubscribe(
    event: string | symbol,
    subscriber: EventBusTypes.Subscriber,
    context: EventBusTypes.SubscriberContext
  ): this {
    this.eventBusModuleService_.unsubscribe(event, subscriber, context)
    return this
  }

  /**
   * Calls all subscribers when an event occurs.
   * @param data - The data to use to process the events
   * @return the jobs from our queue
   */
  async emit<T>(data: EventBusTypes.EmitData<T>[]): Promise<StagedJob[] | void>

  async emit<T>(data: EventBusTypes.Message<T>[]): Promise<StagedJob[] | void>

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
    options?: Record<string, unknown>
  ): Promise<StagedJob | void>

  async emit<
    T,
    TInput extends
      | string
      | EventBusTypes.EmitData<T>[]
      | EventBusTypes.Message<T>[] = string,
    TResult = TInput extends EventBusTypes.EmitData<T>[]
      ? StagedJob[]
      : StagedJob
  >(
    eventNameOrData: TInput,
    data?: T,
    options: Record<string, unknown> = {}
  ): Promise<TResult | void> {
    const manager = this.activeManager_
    const isBulkEmit = !isString(eventNameOrData)
    const dataBody = isString(eventNameOrData)
      ? data ?? (data as Message<T>).body
      : undefined
    const events: EventBusTypes.EmitData[] = isBulkEmit
      ? eventNameOrData.map((event) => ({
          eventName: event.eventName,
          data: (event as EmitData).data ?? (event as Message<T>).body.data,
          options: event.options,
        }))
      : [
          {
            eventName: eventNameOrData,
            data: dataBody,
            options: options,
          },
        ]

    /**
     * We store events in the database when in an ongoing transaction.
     *
     * If we are in a long-running transaction, the ACID properties of a
     * transaction ensure, that events are kept invisible to the enqueuer
     * until the transaction has committed.
     *
     * This patterns also gives us at-least-once delivery of events, as events
     * are only removed from the database, if they are successfully delivered.
     *
     * In case of a failing transaction, jobs stored in the database are removed
     * as part of the rollback.
     */

    const stagedJobs = await this.stagedJobService_
      .withTransaction(manager)
      .create(events)

    return (!isBulkEmit ? stagedJobs[0] : stagedJobs) as unknown as TResult
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
    const listConfig = {
      relations: [],
      skip: 0,
      take: this.config_.projectConfig.jobs_batch_size ?? 1000,
    }

    while (this.shouldEnqueuerRun) {
      await sleep(3000)

      const jobs = await this.listJobs(listConfig)

      if (!jobs.length) {
        continue
      }

      const eventsData = jobs.map((job) => {
        return {
          eventName: job.event_name,
          data: job.data,
          options: { jobId: job.id, ...job.options },
        }
      })

      await this.eventBusModuleService_.emit(eventsData).then(async () => {
        return await this.stagedJobService_.delete(jobs.map((j) => j.id))
      })
    }
  }

  protected async listJobs(listConfig: FindConfig<StagedJob>) {
    return await this.stagedJobService_.list(listConfig).catch((err) => {
      if (DatabaseErrorCode.connectionFailure === err.code) {
        this.logger_.warn(`Database connection failure:${EOL}${err.message}`)
      } else {
        this.logger_.warn(`Failed to fetch jobs:${EOL}${err.message}`)
      }

      return []
    })
  }
}
