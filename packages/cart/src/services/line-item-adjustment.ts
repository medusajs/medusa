import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { LineItemAdjustmentLine } from "@models"
import {
  CreateLineItemAdjustmentDTO,
  UpdateLineItemAdjustmentDTO,
} from "src/types/line-item-adjustment"

type InjectedDependencies = {
  lineItemAdjustmentRepository: DAL.RepositoryService
}

export default class LineItemAdjustmentService<
  TEntity extends LineItemAdjustmentLine = LineItemAdjustmentLine
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateLineItemAdjustmentDTO
    update: UpdateLineItemAdjustmentDTO
  }
>(LineItemAdjustmentLine)<TEntity> {}
