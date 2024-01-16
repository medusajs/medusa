import { DALUtils } from "@medusajs/utils"
import { LineItemAdjustmentLine } from "@models"
import {
  CreateLineItemAdjustmentDTO,
  UpdateLineItemAdjustmentDTO,
} from "src/types/line-item-adjustment"

export class LineItemAdjustmentRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  LineItemAdjustmentLine,
  {
    create: CreateLineItemAdjustmentDTO
    update: UpdateLineItemAdjustmentDTO
  }
>(LineItemAdjustmentLine) {}
