import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionDTO,
  PromotionTypes,
} from "@medusajs/types"

import { ApplicationMethod, Promotion } from "@models"
import { AbstractService } from "@medusajs/utils"
import { IApplicationMethodRepository } from "./repositories"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IApplicationMethodService<
  TEntity extends ApplicationMethod = ApplicationMethod
> extends AbstractService<
    TEntity,
    { applicationMethodRepository: IApplicationMethodRepository<TEntity> },
    {
      create: CreateApplicationMethodDTO
      update: UpdateApplicationMethodDTO
    },
    {
      list: PromotionTypes.FilterableApplicationMethodProps
      listAndCount: PromotionTypes.FilterableApplicationMethodProps
    }
  > {}

export interface CreateApplicationMethodDTO {
  type: ApplicationMethodTypeValues
  target_type: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: string | null
  promotion: Promotion | string | PromotionDTO
  max_quantity?: number | null
}

export interface UpdateApplicationMethodDTO {
  id: string
  type?: ApplicationMethodTypeValues
  target_type?: ApplicationMethodTargetTypeValues
  allocation?: ApplicationMethodAllocationValues
  value?: string | null
  promotion?: Promotion | string | PromotionDTO
  max_quantity?: number | null
}
