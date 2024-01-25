import { LineItemAdjustment } from "@models"
import { AbstractService } from "@medusajs/utils"
import { ILineItemAdjustmentRepository } from "./repositories"

export interface ILineItemAdjustmentService<
  TEntity extends LineItemAdjustment = LineItemAdjustment
> extends AbstractService<
    TEntity,
    {
      lineItemAdjustmentRepository: ILineItemAdjustmentRepository<TEntity>
    },
    {
      create: CreateLineItemAdjustmentDTO
      update: UpdateLineItemAdjustmentDTO
    }
  > {}

export interface CreateLineItemAdjustmentDTO {
  item_id: string
  amount: number
  code?: string
  description?: string
  promotion_id?: string
  provider_id?: string
}

export interface UpdateLineItemAdjustmentDTO
  extends Partial<CreateLineItemAdjustmentDTO> {
  id: string
}
