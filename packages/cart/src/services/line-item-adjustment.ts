import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { LineItemAdjustmentLine } from "@models"
import {
  CreateLineItemAdjustmentDTO,
  UpdateLineItemAdjustmentDTO,
} from "@types"

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
>(LineItemAdjustmentLine)<TEntity> {
  protected readonly lineItemAdjustmentRepository_: DAL.RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
