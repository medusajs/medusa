import { MedusaError } from "medusa-core-utils"
import { AbstractBatchJobStrategy } from "../interfaces"
import BatchJobService from "../services/batch-job"
import EventBusService from "../services/event-bus"

type InjectedDependencies = {
  eventBusService: EventBusService
  batchJobService: BatchJobService
}

class BatchJobSubscriber {
  private readonly eventBusService_: EventBusService
  private readonly batchJobService_: BatchJobService
  private readonly container_: InjectedDependencies

  constructor(container: InjectedDependencies) {
    this.eventBusService_ = container.eventBusService
    this.batchJobService_ = container.batchJobService
    this.container_ = container

    this.eventBusService_
      .subscribe(BatchJobService.Events.CREATED, this.preProcessBatchJob)
      .subscribe(BatchJobService.Events.CONFIRMED, this.processBatchJob)
  }

  preProcessBatchJob = async (data): Promise<void> => {
    const batchJob = await this.batchJobService_.retrieve(data.id)

    const batchJobStrategy = this.getBatchJobStrategy(batchJob.type)

    await batchJobStrategy.preProcessBatchJob(batchJob.id)

    await this.batchJobService_.setPreProcessingDone(batchJob)
  }

  processBatchJob = async (data): Promise<void> => {
    const batchJob = await this.batchJobService_.retrieve(data.id)

    const batchJobStrategy = this.getBatchJobStrategy(batchJob.type)

    await this.batchJobService_.setProcessing(batchJob)

    await batchJobStrategy.processJob(batchJob.id)

    await this.batchJobService_.complete(batchJob)
  }

  getBatchJobStrategy(
    type: string
  ): AbstractBatchJobStrategy<AbstractBatchJobStrategy<never>> {
    const batchJobStrategy = this.container_[`batchType_${type}`]

    if (!batchJobStrategy) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `No batch job strategy found for type ${type}`
      )
    }

    return batchJobStrategy
  }
}

export default BatchJobSubscriber
