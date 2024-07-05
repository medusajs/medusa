import { EntityManager } from "typeorm"
import {
  BatchJobService,
  EventBusService,
  StrategyResolverService,
} from "../services"

type InjectedDependencies = {
  eventBusService: EventBusService
  batchJobService: BatchJobService
  strategyResolverService: StrategyResolverService
  manager: EntityManager
}

class BatchJobSubscriber {
  private readonly eventBusService_: EventBusService
  private readonly batchJobService_: BatchJobService
  private readonly strategyResolver_: StrategyResolverService
  private readonly manager_: EntityManager

  constructor({
    eventBusService,
    batchJobService,
    strategyResolverService,
    manager,
  }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
    this.batchJobService_ = batchJobService
    this.strategyResolver_ = strategyResolverService
    this.manager_ = manager

    this.eventBusService_.subscribe(
      BatchJobService.Events.CREATED,
      this.preProcessBatchJob
    ) as EventBusService

    this.eventBusService_.subscribe(
      BatchJobService.Events.CONFIRMED,
      this.processBatchJob
    ) as EventBusService
  }

  preProcessBatchJob = async (data): Promise<void> => {
    try {
      await this.manager_.transaction(async (manager) => {
        const batchJobServiceTx = this.batchJobService_.withTransaction(manager)
        const batchJob = await batchJobServiceTx.retrieve(data.id)

        const batchJobStrategy = this.strategyResolver_.resolveBatchJobByType(
          batchJob.type
        )

        await batchJobStrategy
          .withTransaction(manager)
          .preProcessBatchJob(batchJob.id)
        await batchJobServiceTx.setPreProcessingDone(batchJob.id)
      })
    } catch (e) {
      await this.batchJobService_.setFailed(data.id, e.message)
      throw e
    }
  }

  processBatchJob = async (data): Promise<void> => {
    try {
      await this.manager_.transaction("REPEATABLE READ", async (manager) => {
        const batchJobServiceTx = this.batchJobService_.withTransaction(manager)
        const batchJob = await batchJobServiceTx.retrieve(data.id)

        const batchJobStrategy = this.strategyResolver_.resolveBatchJobByType(
          batchJob.type
        )

        await batchJobServiceTx.setProcessing(batchJob.id)
        await batchJobStrategy.withTransaction(manager).processJob(batchJob.id)
        await batchJobServiceTx.complete(batchJob.id)
      })
    } catch (e) {
      await this.batchJobService_.setFailed(data.id, e.message)
      throw e
    }
  }
}

export default BatchJobSubscriber
