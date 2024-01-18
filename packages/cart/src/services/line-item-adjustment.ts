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
  protected readonly lineItemAdjustmentRepository_: DAL.RepositoryService<TEntity>

  constructor({ lineItemAdjustmentRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.lineItemAdjustmentRepository_ = lineItemAdjustmentRepository
  }

  @InjectTransactionManager("lineItemAdjustmentRepository_")
  async upsert(
    adjustments: (CreateLineItemAdjustmentDTO | UpdateLineItemAdjustmentDTO)[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.lineItemAdjustmentRepository_.upsert!(
      adjustments,
      sharedContext
    )
  }
}
