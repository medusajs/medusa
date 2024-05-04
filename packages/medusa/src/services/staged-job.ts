import { DeepPartial, EntityManager, In } from "typeorm"

import { EventBusTypes } from "@medusajs/types"
import { FindConfig } from "../types/common"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { StagedJob } from "../models"
import { StagedJobRepository } from "../repositories/staged-job"
import { TransactionBaseService } from "../interfaces"
import { isString } from "../utils"

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

  async delete(stagedJobIds: string | string[]): Promise<void> {
    const manager = this.activeManager_
    const stagedJobRepo = manager.withRepository(this.stagedJobRepository_)
    const sjIds = isString(stagedJobIds) ? [stagedJobIds] : stagedJobIds

    await stagedJobRepo.delete({ id: In(sjIds) })
  }

  async create(data: EventBusTypes.EmitData[] | EventBusTypes.EmitData) {
      const stagedJobRepo = this.activeManager_.withRepository(this.stagedJobRepository_)

      const data_ = Array.isArray(data) ? data : [data]

      const stagedJobs = data_.map((job) =>
        stagedJobRepo.create({
          event_name: job.eventName,
          data: job.data,
          options: job.options,
        } as DeepPartial<StagedJob>)
      ) as QueryDeepPartialEntity<StagedJob>[]

      return await stagedJobRepo.insertBulk(stagedJobs)
  }
}

export default StagedJobService
