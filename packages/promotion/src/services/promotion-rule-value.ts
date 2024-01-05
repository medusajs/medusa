import { Context, DAL, FindConfig, PromotionTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { PromotionRuleValue } from "@models"
import { PromotionRuleValueRepository } from "@repositories"
import {
  CreatePromotionRuleValueDTO,
  UpdatePromotionRuleValueDTO,
} from "../types"

type InjectedDependencies = {
  promotionRuleValueRepository: DAL.RepositoryService
}

export default class PromotionRuleValueService<
  TEntity extends PromotionRuleValue = PromotionRuleValue
> {
  protected readonly promotionRuleValueRepository_: DAL.RepositoryService

  constructor({ promotionRuleValueRepository }: InjectedDependencies) {
    this.promotionRuleValueRepository_ = promotionRuleValueRepository
  }

  @InjectManager("promotionRuleValueRepository_")
  async retrieve(
    promotionRuleValueId: string,
    config: FindConfig<PromotionTypes.PromotionRuleValueDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      PromotionRuleValue,
      PromotionTypes.PromotionRuleValueDTO
    >({
      id: promotionRuleValueId,
      entityName: PromotionRuleValue.name,
      repository: this.promotionRuleValueRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("promotionRuleValueRepository_")
  async list(
    filters: PromotionTypes.FilterablePromotionRuleValueProps = {},
    config: FindConfig<PromotionTypes.PromotionRuleValueDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PromotionRuleValue>(
      filters,
      config
    )

    return (await this.promotionRuleValueRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("promotionRuleValueRepository_")
  async listAndCount(
    filters: PromotionTypes.FilterablePromotionRuleValueProps = {},
    config: FindConfig<PromotionTypes.PromotionRuleValueDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<PromotionRuleValue>(
      filters,
      config
    )

    return (await this.promotionRuleValueRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("promotionRuleValueRepository_")
  async create(
    data: CreatePromotionRuleValueDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.promotionRuleValueRepository_ as PromotionRuleValueRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("promotionRuleValueRepository_")
  async update(
    data: UpdatePromotionRuleValueDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.promotionRuleValueRepository_ as PromotionRuleValueRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("promotionRuleValueRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.promotionRuleValueRepository_.delete(ids, sharedContext)
  }
}
