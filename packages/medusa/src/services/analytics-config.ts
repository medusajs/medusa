import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { AnalyticsConfig } from "../models"
import { AnalyticsConfigRepository as AnalyticsRepository } from "../repositories/analytics-config"
import {
  CreateAnalyticsConfig,
  UpdateAnalyticsConfig,
} from "../types/analytics-config"
import UserService from "./user"

type InjectedDependencies = {
  analyticsConfigRepository: typeof AnalyticsRepository
  manager: EntityManager
}

class AnalyticsConfigService extends TransactionBaseService {
  protected readonly analyticsConfigRepository_: typeof AnalyticsRepository
  protected readonly userService_: UserService

  constructor({ analyticsConfigRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.analyticsConfigRepository_ = analyticsConfigRepository
  }

  async retrieve(userId: string): Promise<AnalyticsConfig> {
    const analyticsRepo = this.activeManager_.withRepository(
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

  /**
   * Creates an analytics config.
   */
  async create(
    userId: string,
    data: CreateAnalyticsConfig
  ): Promise<AnalyticsConfig> {
    const analyticsRepo = this.activeManager_.withRepository(
      this.analyticsConfigRepository_
    )

    const config = analyticsRepo.create({ user_id: userId, ...data })
    return await analyticsRepo.save(config)
  }

  /**
   * Updates an analytics config. If the config does not exist, it will be created instead.
   */
  async update(
    userId: string,
    update: UpdateAnalyticsConfig
  ): Promise<AnalyticsConfig> {
    const analyticsRepo = this.activeManager_.withRepository(
      this.analyticsConfigRepository_
    )

    const config = await this.retrieve(userId).catch(() => undefined)

    if (!config) {
      return this.create(userId, {
        opt_out: update.opt_out ?? false,
        anonymize: update.anonymize ?? false,
      })
    }

    for (const [key, value] of Object.entries(update)) {
      if (value !== undefined) {
        config[key] = value
      }
    }

    return await analyticsRepo.save(config)
  }

  /**
   * Deletes an analytics config.
   */
  async delete(userId: string): Promise<void> {
    const analyticsRepo = this.activeManager_.withRepository(
      this.analyticsConfigRepository_
    )

    const config = await this.retrieve(userId).catch(() => undefined)

    if (!config) {
      return
    }

    await analyticsRepo.softRemove(config)
  }
}

export default AnalyticsConfigService
