import { EntityManager } from "typeorm"
import { AbstractEventBusModuleService } from "../interfaces"
import { StagedJob } from "../models"
import { sleep } from "../utils/sleep"
import StagedJobService from "./staged-job"

type InjectedDependencies = {
  manager: EntityManager
  stagedJobService: StagedJobService
  eventBusService: AbstractEventBusModuleService
}

export default class EventBusService extends AbstractEventBusModuleService {
  protected readonly stagedJobService_: StagedJobService
  protected readonly eventBusService_: AbstractEventBusModuleService

  protected shouldEnqueuerRun: boolean
  protected enqueue_: Promise<void>

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor({
    manager,
    stagedJobService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.eventBusService_ = eventBusService
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
    options?: Record<string, unknown>
  ): Promise<StagedJob | void> {
    const manager = this.transactionManager_ ?? this.manager_
    /**
     * We always store events in the database.
     *
     * If we are in a long-running transaction, the ACID properties of a
     * transaction ensure, that events are kept invisible to the enqueuer
     * until the trasaction has commited.
     *
     * This patterns also gives us at-least-once delivery of events, as events
     * are only removed from the database, if they are successfully delivered.
     *
     * In case of a failing transaction, jobs stored in the database are removed
     * as part of the rollback.
     */
    const jobToCreate = {
      event_name: eventName,
      data: data as unknown as Record<string, unknown>,
      options,
    } as Partial<StagedJob>

    return await this.stagedJobService_
      .withTransaction(manager)
      .create(jobToCreate)
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

      // TODO: Refactor to a sleeper with exponential backoff and make it configurable
      await sleep(3000)
    }
  }
}
