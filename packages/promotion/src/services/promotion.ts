import { Context, DAL, FindConfig, PromotionTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { Promotion } from "@models"
import { PromotionRepository } from "@repositories"
import { CreatePromotionDTO, UpdatePromotionDTO } from "../types"

type InjectedDependencies = {
  promotionRepository: DAL.RepositoryService
}

export default class PromotionService<TEntity extends Promotion = Promotion> {
  protected readonly promotionRepository_: DAL.RepositoryService

  constructor({ promotionRepository }: InjectedDependencies) {
    this.promotionRepository_ = promotionRepository
  }

  @InjectManager("promotionRepository_")
  async retrieve(
    promotionId: string,
    config: FindConfig<PromotionTypes.PromotionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<Promotion, PromotionTypes.PromotionDTO>({
      id: promotionId,
      entityName: Promotion.name,
      repository: this.promotionRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("promotionRepository_")
  async list(
    filters: PromotionTypes.FilterablePromotionProps = {},
    config: FindConfig<PromotionTypes.PromotionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<Promotion>(filters, config)

    return (await this.promotionRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("promotionRepository_")
  async listAndCount(
    filters: PromotionTypes.FilterablePromotionProps = {},
    config: FindConfig<PromotionTypes.PromotionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<Promotion>(filters, config)

    return (await this.promotionRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("promotionRepository_")
  async create(
    data: CreatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.promotionRepository_ as PromotionRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("promotionRepository_")
  async update(
    data: UpdatePromotionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.promotionRepository_ as PromotionRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("promotionRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.promotionRepository_.delete(ids, sharedContext)
  }
}
