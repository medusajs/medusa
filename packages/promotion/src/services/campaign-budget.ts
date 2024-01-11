import { Context, DAL, FindConfig, PromotionTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { CampaignBudget } from "@models"
import { CampaignBudgetRepository } from "@repositories"
import { CreateCampaignBudgetDTO, UpdateCampaignBudgetDTO } from "../types"

type InjectedDependencies = {
  campaignBudgetRepository: DAL.RepositoryService
}

export default class CampaignBudgetService<
  TEntity extends CampaignBudget = CampaignBudget
> {
  protected readonly campaignBudgetRepository_: DAL.RepositoryService

  constructor({ campaignBudgetRepository }: InjectedDependencies) {
    this.campaignBudgetRepository_ = campaignBudgetRepository
  }

  @InjectManager("campaignBudgetRepository_")
  async retrieve(
    campaignBudgetId: string,
    config: FindConfig<PromotionTypes.CampaignBudgetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      CampaignBudget,
      PromotionTypes.CampaignBudgetDTO
    >({
      id: campaignId,
      entityName: CampaignBudget.name,
      repository: this.campaignBudgetRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("campaignBudgetRepository_")
  async list(
    filters: PromotionTypes.FilterableCampaignBudgetProps = {},
    config: FindConfig<PromotionTypes.CampaignBudgetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<CampaignBudget>(
      filters,
      config
    )

    return (await this.campaignBudgetRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("campaignBudgetRepository_")
  async listAndCount(
    filters: PromotionTypes.FilterableCampaignBudgetProps = {},
    config: FindConfig<PromotionTypes.CampaignBudgetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<CampaignBudget>(
      filters,
      config
    )

    return (await this.campaignBudgetRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("campaignBudgetRepository_")
  async create(
    data: CreateCampaignBudgetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.campaignBudgetRepository_ as CampaignBudgetRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("campaignBudgetRepository_")
  async update(
    data: UpdateCampaignBudgetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.campaignBudgetRepository_ as CampaignBudgetRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("campaignBudgetRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.campaignBudgetRepository_.delete(ids, sharedContext)
  }
}
