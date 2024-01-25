import { ShippingMethod } from "@models"
import { AbstractService } from "@medusajs/utils"
import { IShippingMethodRepository } from "./repositories"

export interface IShippingMethodService<
  TEntity extends ShippingMethod = ShippingMethod
> extends AbstractService<
    TEntity,
    {
      shippingMethodRepository: IShippingMethodRepository<TEntity>
    },
    {
      create: CreateShippingMethodDTO
      update: UpdateShippingMethodDTO
    }
  > {}

export interface CreateShippingMethodDTO {
  name: string
  shippingMethod_id: string
  amount: number
  data?: Record<string, unknown>
}

export interface UpdateShippingMethodDTO {
  id: string
  name?: string
  amount?: number
  data?: Record<string, unknown>
}
