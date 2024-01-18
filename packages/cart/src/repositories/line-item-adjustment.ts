import { DALUtils } from "@medusajs/utils"
import { LineItemAdjustmentLine } from "@models"
import {
  CreateLineItemAdjustmentDTO,
  UpdateLineItemAdjustmentDTO,
} from "@types"

export class LineItemAdjustmentRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  LineItemAdjustmentLine,
  {
    create: CreateLineItemAdjustmentDTO
    update: UpdateLineItemAdjustmentDTO
  }
>(LineItemAdjustmentLine) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
