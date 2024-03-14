import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CampaignDTO,
  ComputeActionContext,
  ComputeActions,
  CreatePromotionDTO,
  CreatePromotionRuleDTO,
  FilterableCampaignProps,
  FilterablePromotionProps,
  PromotionDTO,
  PromotionRuleDTO,
  RemovePromotionRuleDTO,
  UpdatePromotionDTO,
} from "./common"
import { CreateCampaignDTO, UpdateCampaignDTO } from "./mutations"

export interface IPromotionModuleService extends IModuleService {
  registerUsage(computedActions: ComputeActions[]): Promise<void>

  computeActions(
    promotionCodesToApply: string[],
    applicationContext: ComputeActionContext,
    options?: Record<string, any>
  ): Promise<ComputeActions[]>

  create(
    data: CreatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

  create(
    data: CreatePromotionDTO,
    sharedContext?: Context
  ): Promise<PromotionDTO>

  update(
    data: UpdatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

  update(
    data: UpdatePromotionDTO,
    sharedContext?: Context
  ): Promise<PromotionDTO>

  list(
    filters?: FilterablePromotionProps,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

  listAndCount(
    filters?: FilterablePromotionProps,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<[PromotionDTO[], number]>

  retrieve(
    id: string,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<PromotionDTO>

  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(ids: string, sharedContext?: Context): Promise<void>

  softDelete<TReturnableLinkableKeys extends string = string>(
    promotionIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    promotionIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  addPromotionRules(
    promotionId: string,
    rulesData: CreatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionRuleDTO[]>

  addPromotionTargetRules(
    promotionId: string,
    rulesData: CreatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionRuleDTO[]>

  addPromotionBuyRules(
    promotionId: string,
    rulesData: CreatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionRuleDTO[]>

  removePromotionRules(
    promotionId: string,
    rulesData: RemovePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<void>

  removePromotionTargetRules(
    promotionId: string,
    rulesData: RemovePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<void>

  removePromotionBuyRules(
    promotionId: string,
    rulesData: RemovePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<void>

  createCampaigns(
    data: CreateCampaignDTO,
    sharedContext?: Context
  ): Promise<CampaignDTO>

  createCampaigns(
    data: CreateCampaignDTO[],
    sharedContext?: Context
  ): Promise<CampaignDTO[]>

  updateCampaigns(
    data: UpdateCampaignDTO[],
    sharedContext?: Context
  ): Promise<CampaignDTO[]>

  updateCampaigns(
    data: UpdateCampaignDTO,
    sharedContext?: Context
  ): Promise<CampaignDTO>

  listCampaigns(
    filters?: FilterableCampaignProps,
    config?: FindConfig<CampaignDTO>,
    sharedContext?: Context
  ): Promise<CampaignDTO[]>

  listAndCountCampaigns(
    filters?: FilterableCampaignProps,
    config?: FindConfig<CampaignDTO>,
    sharedContext?: Context
  ): Promise<[CampaignDTO[], number]>

  retrieveCampaign(
    id: string,
    config?: FindConfig<CampaignDTO>,
    sharedContext?: Context
  ): Promise<CampaignDTO>

  deleteCampaigns(ids: string[], sharedContext?: Context): Promise<void>
  deleteCampaigns(ids: string, sharedContext?: Context): Promise<void>

  softDeleteCampaigns<TReturnableLinkableKeys extends string = string>(
    campaignIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restoreCampaigns<TReturnableLinkableKeys extends string = string>(
    campaignIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}
