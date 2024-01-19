import { DALUtils } from "@medusajs/utils"
import { LineItemAdjustment } from "@models"
import {
  CreateLineItemAdjustmentDTO,
  UpdateLineItemAdjustmentDTO,
} from "@types"

export class LineItemAdjustmentRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  LineItemAdjustment,
  {
    create: CreateLineItemAdjustmentDTO
    update: UpdateLineItemAdjustmentDTO
  }
>(LineItemAdjustment) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
