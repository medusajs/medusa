import { CreateLineItemAdjustmentDTO } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { LineItemAdjustmentLine } from "@models"

export class LineItemAdjustmentRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  LineItemAdjustmentLine,
  {
    create: CreateLineItemAdjustmentDTO
  }
>(LineItemAdjustmentLine) {}
