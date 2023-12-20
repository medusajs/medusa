import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  PromotionTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"

import { Promotion } from "@models"
import { PromotionService } from "@services"

import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  promotionService: PromotionService
}

export default class PromotionModuleService<
  TPromotion extends Promotion = Promotion
> implements PromotionTypes.IPromotionModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected promotionService_: PromotionService

  constructor(
    { baseRepository, promotionService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.promotionService_ = promotionService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async list(
    filters: PromotionTypes.FilterablePromotionProps = {},
    config: FindConfig<PromotionTypes.PromotionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO[]> {
    const promotions = await this.promotionService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PromotionTypes.PromotionDTO[]>(
      promotions,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async create(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PromotionTypes.PromotionDTO[]> {
    const promotions = await this.create_(data, sharedContext)

    const dbPromotions = await this.list(
      { id: promotions.map((p) => p!.id) },
      {},
      sharedContext
    )

    return dbPromotions
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: PromotionTypes.CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.promotionService_.create(data, sharedContext)
  }
}
