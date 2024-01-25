import { ShippingMethodAdjustment } from "@models"
import { AbstractService } from "@medusajs/utils"
import { IShippingMethodAdjustmentRepository } from "./repositories"

export interface IShippingMethodAdjustmentService<
  TEntity extends ShippingMethodAdjustment = ShippingMethodAdjustment
> extends AbstractService<
    TEntity,
    {
      shippingMethodAdjustmentRepository: IShippingMethodAdjustmentRepository<TEntity>
    },
    {
      create: CreateShippingMethodAdjustmentDTO
      update: UpdateShippingMethodAdjustmentDTO
    }
  > {}

export interface CreateShippingMethodAdjustmentDTO {
  shipping_method_id: string
  code: string
  amount: number
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateShippingMethodAdjustmentDTO {
  id: string
  code?: string
  amount?: number
  description?: string
  promotion_id?: string
  provider_id?: string
}
