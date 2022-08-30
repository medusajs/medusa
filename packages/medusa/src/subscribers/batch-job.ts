import BatchJobService from "../services/batch-job"
import EventBusService from "../services/event-bus"
import { StrategyResolverService } from "../services"

type InjectedDependencies = {
  eventBusService: EventBusService
  batchJobService: BatchJobService
  strategyResolverService: StrategyResolverService
}

class BatchJobSubscriber {
  private readonly eventBusService_: EventBusService
  private readonly batchJobService_: BatchJobService
  private readonly strategyResolver_: StrategyResolverService

  constructor({
    eventBusService,
    batchJobService,
    strategyResolverService,
  }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
    this.batchJobService_ = batchJobService
    this.strategyResolver_ = strategyResolverService

    this.eventBusService_
      .subscribe(BatchJobService.Events.CREATED, this.preProcessBatchJob)
      .subscribe(BatchJobService.Events.CONFIRMED, this.processBatchJob)
  }

  preProcessBatchJob = async (data): Promise<void> => {
    const batchJob = await this.batchJobService_.retrieve(data.id)

    const batchJobStrategy = this.strategyResolver_.resolveBatchJobByType(
      batchJob.type
    )

    try {
      await batchJobStrategy.preProcessBatchJob(batchJob.id)
      await this.batchJobService_.setPreProcessingDone(batchJob.id)
    } catch (e) {
      await this.batchJobService_.setFailed(batchJob.id)
      throw e
    }
  }

  processBatchJob = async (data): Promise<void> => {
    const batchJob = await this.batchJobService_.retrieve(data.id)

    const batchJobStrategy = this.strategyResolver_.resolveBatchJobByType(
      batchJob.type
    )

    await this.batchJobService_.setProcessing(batchJob.id)

    try {
      await batchJobStrategy.processJob(batchJob.id)
      await this.batchJobService_.complete(batchJob.id)
    } catch (e) {
      await this.batchJobService_.setFailed(batchJob.id)
      throw e
    }
  }
}

export default BatchJobSubscriber
