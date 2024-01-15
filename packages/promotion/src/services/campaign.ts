import { Context, DAL, FindConfig, PromotionTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { Campaign } from "@models"
import { CampaignRepository } from "@repositories"
import { CreateCampaignDTO, UpdateCampaignDTO } from "../types"

type InjectedDependencies = {
  campaignRepository: DAL.RepositoryService
}

export default class CampaignService<TEntity extends Campaign = Campaign> {
  protected readonly campaignRepository_: DAL.RepositoryService

  constructor({ campaignRepository }: InjectedDependencies) {
    this.campaignRepository_ = campaignRepository
  }

  @InjectManager("campaignRepository_")
  async retrieve(
    campaignId: string,
    config: FindConfig<PromotionTypes.CampaignDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<Campaign, PromotionTypes.CampaignDTO>({
      id: campaignId,
      entityName: Campaign.name,
      repository: this.campaignRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("campaignRepository_")
  async list(
    filters: PromotionTypes.FilterableCampaignProps = {},
    config: FindConfig<PromotionTypes.CampaignDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<Campaign>(filters, config)

    return (await this.campaignRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("campaignRepository_")
  async listAndCount(
    filters: PromotionTypes.FilterableCampaignProps = {},
    config: FindConfig<PromotionTypes.CampaignDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<Campaign>(filters, config)

    return (await this.campaignRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("campaignRepository_")
  async create(
    data: CreateCampaignDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.campaignRepository_ as CampaignRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("campaignRepository_")
  async update(
    data: UpdateCampaignDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.campaignRepository_ as CampaignRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("campaignRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.campaignRepository_.delete(ids, sharedContext)
  }
}
