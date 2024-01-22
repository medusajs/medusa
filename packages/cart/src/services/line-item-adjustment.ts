import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { LineItemAdjustment } from "@models"
import {
  CreateLineItemAdjustmentDTO,
  UpdateLineItemAdjustmentDTO,
} from "@types"

type InjectedDependencies = {
  lineItemAdjustmentRepository: DAL.RepositoryService
}

export default class LineItemAdjustmentService<
  TEntity extends LineItemAdjustment = LineItemAdjustment
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateLineItemAdjustmentDTO
    update: UpdateLineItemAdjustmentDTO
  }
>(LineItemAdjustment)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
