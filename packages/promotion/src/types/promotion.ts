import { PromotionTypes, PromotionTypeValues } from "@medusajs/types"

import { Promotion } from "@models"
import { AbstractService } from "@medusajs/utils"
import { IPromotionRepository } from "./repositories"

export interface IPromotionService<TEntity extends Promotion = Promotion>
  extends AbstractService<
    TEntity,
    { promotionRepository: IPromotionRepository<TEntity> },
    {
      create: CreatePromotionDTO
      update: UpdatePromotionDTO
    },
    {
      list: PromotionTypes.FilterablePromotionProps
      listAndCount: PromotionTypes.FilterablePromotionProps
    }
  > {}

export interface CreatePromotionDTO {
  code: string
  type: PromotionTypeValues
  is_automatic?: boolean
  campaign?: string
}

export interface UpdatePromotionDTO {
  id: string
  code?: string
  type?: PromotionTypeValues
  is_automatic?: boolean
  campaign?: string
}
