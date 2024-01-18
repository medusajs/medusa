import { Context, DAL } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
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
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }

  @InjectTransactionManager("productImageRepository_")
  async upsert(
    adjustments: (CreateLineItemAdjustmentDTO | UpdateLineItemAdjustmentDTO)[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.__container__.lineItemAdjustmentRepository.upsert!(
      adjustments,
      sharedContext
    )
  }
}
