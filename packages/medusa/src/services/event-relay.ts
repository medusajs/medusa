import {
  ConfigModule,
  Logger,
  StagedJob,
  StagedJobService,
} from "@medusajs/medusa"
import { EntityManager } from "typeorm"
import { AbstractEventBusService, TransactionBaseService } from "../interfaces"
import { sleep } from "../utils/sleep"

type InjectedDependencies = {
  manager: EntityManager
  logger: Logger
  stagedJobService: StagedJobService
  configModule: ConfigModule
  eventBusService: AbstractEventBusService
}

export default class EventRelayService extends TransactionBaseService {
  protected readonly config_: ConfigModule
  protected readonly logger_: Logger
  protected readonly stagedJobService_: StagedJobService
  protected readonly eventBusService_: AbstractEventBusService

  protected shouldEnqueuerRun: boolean
  protected enqueue_: Promise<void>

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor({
    manager,
    logger,
    stagedJobService,
    configModule,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.config_ = configModule
    this.manager_ = manager
    this.eventBusService_ = eventBusService

    this.logger_ = logger
    this.stagedJobService_ = stagedJobService
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
    options: Record<string, unknown>
  ): Promise<StagedJob | void> {
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
        options,
      } as Partial<StagedJob>

      return await this.stagedJobService_
        .withTransaction(this.transactionManager_)
        .create(jobToCreate)
    }

    await this.eventBusService_.emit(eventName, { eventName, data }, options)
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
        jobs.map(async (job) => {
          await this.eventBusService_
            .emit(
              job.event_name,
              { eventName: job.event_name, data: job.data },
              job.options
            )
            .then(async () => {
              await this.stagedJobService_.remove(job)
            })
        })
      )

      await sleep(3000)
    }
  }
}
