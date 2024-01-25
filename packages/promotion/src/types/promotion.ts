import { PromotionType, PromotionTypes } from "@medusajs/types"
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
  type: PromotionType
  is_automatic?: boolean
  campaign?: string
}

export interface UpdatePromotionDTO {
  id: string
  code?: string
  // TODO: add this when buyget is available
  // type: PromotionType
  is_automatic?: boolean
  campaign?: string
}
