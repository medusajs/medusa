import { FindConfig } from "../common"
import { ModuleJoinerConfig } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CreatePromotionDTO,
  FilterablePromotionProps,
  PromotionDTO,
} from "./common"

export interface IPromotionModuleService {
  __joinerConfig(): ModuleJoinerConfig

  create(
    data: CreatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

  list(
    filters?: FilterablePromotionProps,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<PromotionDTO[]>
}
