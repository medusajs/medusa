import { EventBusTypes } from "@medusajs/types"
import { DeepPartial, EntityManager, In } from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { TransactionBaseService } from "../interfaces"
import { StagedJob } from "../models"
import { StagedJobRepository } from "../repositories/staged-job"
import { FindConfig } from "../types/common"

type StagedJobServiceProps = {
  manager: EntityManager
  stagedJobRepository: typeof StagedJobRepository
}

/**
 * Provides layer to manipulate users.
 */
class StagedJobService extends TransactionBaseService {
  protected stagedJobRepository_: typeof StagedJobRepository

  constructor({ stagedJobRepository }: StagedJobServiceProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.stagedJobRepository_ = stagedJobRepository
  }

  async list(config: FindConfig<StagedJob>) {
    const stagedJobRepo = this.activeManager_.withRepository(
      this.stagedJobRepository_
    )

    return await stagedJobRepo.find(config)
  }

  async deleteBulk(stagedJobIds: string[]): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const stagedJobRepo = manager.withRepository(this.stagedJobRepository_)

      await stagedJobRepo.delete({ id: In(stagedJobIds) })
    })
  }

  async insertBulk(stagedJobsInput: EventBusTypes.EmitData[]) {
    return this.atomicPhase_(async (manager) => {
      const stagedJobRepo = manager.withRepository(this.stagedJobRepository_)

      const stagedJobs = stagedJobsInput.map(
        (job) =>
          ({
            event_name: job.eventName,
            data: job.data,
            options: job.options,
          } as DeepPartial<StagedJob>)
      ) as QueryDeepPartialEntity<StagedJob>[]

      return await stagedJobRepo.insertBulk(stagedJobs)
    })
  }
}

export default StagedJobService
