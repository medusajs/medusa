import { EntityManager } from "typeorm"
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
  protected manager_: EntityManager
  protected transactionManager_: EntityManager
  protected stagedJobRepository_: typeof StagedJobRepository

  constructor({ manager, stagedJobRepository }: StagedJobServiceProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.stagedJobRepository_ = stagedJobRepository
  }

  async create(data: Partial<StagedJob>) {
    return this.atomicPhase_(async (manager) => {
      const stagedJobRepo = manager.getCustomRepository(
        this.stagedJobRepository_
      )

      const stagedJob = stagedJobRepo.create(data)
      return await stagedJobRepo.save(stagedJob)
    })
  }

  async list(config: FindConfig<StagedJob>) {
    const stagedJobRepo = this.manager_.getCustomRepository(
      this.stagedJobRepository_
    )

    return await stagedJobRepo.find(config)
  }

  async remove(stagedJob: StagedJob) {
    const stagedJobRepo = this.manager_.getCustomRepository(
      this.stagedJobRepository_
    )

    const [job] = await stagedJobRepo.find({ where: { id: stagedJob.id } })

    if (!job) {
      return
    }

    return await stagedJobRepo.remove(job)
  }
}

export default StagedJobService
