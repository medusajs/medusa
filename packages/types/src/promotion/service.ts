import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CampaignDTO,
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
  computeActions(
    promotionsToApply: Pick<PromotionDTO, "code">[],
    applicationContext: Record<string, any>,
    options?: Record<string, any>
  ): Promise<Record<string, any>[]>

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

  retrieve(
    id: string,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<PromotionDTO>

  delete(ids: string[], sharedContext?: Context): Promise<void>
  delete(ids: string, sharedContext?: Context): Promise<void>

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

  retrieveCampaign(
    id: string,
    config?: FindConfig<CampaignDTO>,
    sharedContext?: Context
  ): Promise<CampaignDTO>

  deleteCampaigns(ids: string[], sharedContext?: Context): Promise<void>
  deleteCampaigns(ids: string, sharedContext?: Context): Promise<void>
}
