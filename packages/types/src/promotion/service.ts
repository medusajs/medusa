import { FindConfig } from "../common"
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

  softDelete(ids: string[], sharedContext?: Context): Promise<void>
  softDelete(ids: string, sharedContext?: Context): Promise<void>

  restore(ids: string[], sharedContext?: Context): Promise<void>
  restore(ids: string, sharedContext?: Context): Promise<void>

  addPromotionRules(
    promotionId: string,
    rulesData: CreatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO>

  addPromotionTargetRules(
    promotionId: string,
    rulesData: CreatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO>

  removePromotionRules(
    promotionId: string,
    rulesData: RemovePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO>

  removePromotionTargetRules(
    promotionId: string,
    rulesData: RemovePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO>

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

  softDeleteCampaigns(ids: string[], sharedContext?: Context): Promise<void>
  softDeleteCampaigns(ids: string, sharedContext?: Context): Promise<void>

  restoreCampaigns(ids: string[], sharedContext?: Context): Promise<void>
  restoreCampaigns(ids: string, sharedContext?: Context): Promise<void>
}
