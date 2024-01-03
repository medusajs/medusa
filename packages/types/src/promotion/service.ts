import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CreatePromotionDTO,
  CreatePromotionRuleDTO,
  FilterablePromotionProps,
  PromotionDTO,
  UpdatePromotionDTO,
} from "./common"

export interface IPromotionModuleService extends IModuleService {
  create(
    data: CreatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

  update(
    data: UpdatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

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
}
