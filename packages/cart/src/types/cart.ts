import {
  CreateLineItemAdjustmentDTO,
  UpdateLineItemAdjustmentDTO,
} from "./line-item-adjustment"
import { Cart } from "@models"
import { AbstractService } from "@medusajs/utils"
import { ICartRepository } from "./repositories"

export interface ICartService<TEntity extends Cart = Cart>
  extends AbstractService<
    TEntity,
    {
      cartRepository: ICartRepository<TEntity>
    },
    {
      create: CreateCartDTO
      update: UpdateCartDTO
    }
  > {}

export interface CreateCartDTO {
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code: string
  metadata?: Record<string, unknown>
}

export interface UpdateCartDTO {
  id: string
  region_id?: string
  customer_id?: string
  sales_channel_id?: string
  email?: string
  currency_code?: string
  metadata?: Record<string, unknown>

  adjustments?: (CreateLineItemAdjustmentDTO | UpdateLineItemAdjustmentDTO)[]
}
