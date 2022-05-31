import { AwilixContainer } from "awilix"
import { MedusaError } from "medusa-core-utils"
import { AbstractBatchJobStrategy } from "../interfaces/batch-job-strategy"
import BatchJobService from "../services/batch-job"
import EventBusService from "../services/event-bus"

class BatchJobSubscriber {
  private readonly eventBusService_: EventBusService
  private readonly batchJobService_: BatchJobService
  private readonly container_: AwilixContainer

  constructor(container: AwilixContainer) {
    this.eventBusService_ = container["eventBusService"]
    this.batchJobService_ = container["batchJobService"]
    this.container_ = container

    // this.eventBusService_.subscribe(
    //   BatchJobService.Events.CREATED,
    //   this.setReady
    // )
    this.eventBusService_.subscribe(
      BatchJobService.Events.READY,
      this.processBatchJob
    )
    this.eventBusService_.subscribe(
      BatchJobService.Events.CONFIRMED,
      this.completeBatchJob
    )
  }

  // setReady = async (data): Promise<void> => {
  //   const batchJob = await this.batchJobService_.retrieve(data.id)

  //   const batchJobStrategy = this.getBatchJobStrategy(batchJob.type)

  //   // ts-ignore
  //   await batchJobStrategy.prepareBatchJobForProcessing(data.id, {})
  // }

  processBatchJob = async (data): Promise<void> => {
    const batchJob = await this.batchJobService_.retrieve(data.id)

    const batchJobStrategy = this.getBatchJobStrategy(batchJob.type)

    await this.batchJobService_.processing(batchJob)

    await batchJobStrategy.processJob(batchJob.id)
  }

  completeBatchJob = async (data): Promise<void> => {
    const batchJob = await this.batchJobService_.retrieve(data.id)

    const batchJobStrategy = this.getBatchJobStrategy(batchJob.type)

    await batchJobStrategy.completeJob(batchJob.id)
  }

  getBatchJobStrategy(type: string): AbstractBatchJobStrategy<any> {
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
