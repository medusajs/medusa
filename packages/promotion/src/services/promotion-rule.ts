import { Context, DAL, FindConfig, PromotionTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { PromotionRule } from "@models"
import { PromotionRuleRepository } from "@repositories"
import { CreatePromotionRuleDTO, UpdatePromotionRuleDTO } from "../types"

type InjectedDependencies = {
  promotionRuleRepository: DAL.RepositoryService
}

export default class PromotionRuleService<
  TEntity extends PromotionRule = PromotionRule
> {
  protected readonly promotionRuleRepository_: DAL.RepositoryService

  constructor({ promotionRuleRepository }: InjectedDependencies) {
    this.promotionRuleRepository_ = promotionRuleRepository
  }

  @InjectManager("promotionRuleRepository_")
  async retrieve(
    promotionRuleId: string,
    config: FindConfig<PromotionTypes.PromotionRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      PromotionRule,
      PromotionTypes.PromotionRuleDTO
    >({
      id: promotionRuleId,
      entityName: PromotionRule.name,
      repository: this.promotionRuleRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("promotionRuleRepository_")
  async list(
    filters: PromotionTypes.FilterablePromotionRuleProps = {},
    config: FindConfig<PromotionTypes.PromotionRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PromotionRule>(
      filters,
      config
    )

    return (await this.promotionRuleRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("promotionRuleRepository_")
  async listAndCount(
    filters: PromotionTypes.FilterablePromotionRuleProps = {},
    config: FindConfig<PromotionTypes.PromotionRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PromotionRule>(
      filters,
      config
    )

    return (await this.promotionRuleRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("promotionRuleRepository_")
  async create(
    data: CreatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.promotionRuleRepository_ as PromotionRuleRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("promotionRuleRepository_")
  async update(
    data: UpdatePromotionRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.promotionRuleRepository_ as PromotionRuleRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("promotionRuleRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.promotionRuleRepository_.delete(ids, sharedContext)
  }
}
