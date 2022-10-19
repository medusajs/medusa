import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { AnalyticsConfigRepository as AnalyticsRepository } from "../repositories/analytics-config"
import {
  CreateAnalyticsConfig,
  UpdateAnalyticsConfig,
} from "../types/analytics-config"
import { formatException } from "../utils"
import UserService from "./user"

type InjectedDependencies = {
  analyticsConfigRepository: typeof AnalyticsRepository
  userService: UserService
  manager: EntityManager
}

class AnalyticsConfigService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly analyticsConfigRepository_: typeof AnalyticsRepository
  protected readonly userService_: UserService

  constructor({
    analyticsConfigRepository,
    userService,
    manager,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.analyticsConfigRepository_ = analyticsConfigRepository
    this.userService_ = userService
  }

  async retrieve(userId: string) {
    const manager = this.manager_

    const analyticsRepo = manager.getCustomRepository(
      this.analyticsConfigRepository_
    )

    const analyticsConfig = await analyticsRepo.findOne({
      where: { user_id: userId },
    })

    if (!analyticsConfig) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No analytics config found for user with id: ${userId}`
      )
    }

    return analyticsConfig
  }

  async create(userId: string, data: CreateAnalyticsConfig) {
    return await this.atomicPhase_(async (transactionManager) => {
      const analyticsRepo = transactionManager.getCustomRepository(
        this.analyticsConfigRepository_
      )

      try {
        const config = analyticsRepo.create({ user_id: userId, ...data })
        return await analyticsRepo.save(config)
      } catch (error) {
        throw formatException(error)
      }
    })
  }

  async update(userId: string, update: UpdateAnalyticsConfig) {
    return await this.atomicPhase_(async (transactionManager) => {
      const analyticsRepo = transactionManager.getCustomRepository(
        this.analyticsConfigRepository_
      )

      const config = await this.retrieve(userId)

      for (const [key, value] of Object.entries(update)) {
        config[key] = value
      }

      return await analyticsRepo.save(config)
    })
  }

  async delete(userId: string) {
    return await this.atomicPhase_(async (transactionManager) => {
      const analyticsRepo = transactionManager.getCustomRepository(
        this.analyticsConfigRepository_
      )

      const config = await this.retrieve(userId).catch(() => void 0)

      if (!config) {
        return
      }

      await analyticsRepo.softRemove(config)
    })
  }
}

export default AnalyticsConfigService
