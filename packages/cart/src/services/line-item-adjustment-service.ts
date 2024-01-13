import {
  Context,
  CreateLineItemAdjustmentDTO,
  DAL,
  FindConfig,
  LineItemAdjustmentLineDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { Address, LineItemAdjustmentLine } from "@models"
import { LineItemAdjustmentRepository } from "@repositories"
import CartService from "./cart"

type InjectedDependencies = {
  lineItemAdjustmentRepository: DAL.RepositoryService
  cartService: CartService
}

export default class LineItemAdjustmentService<
  TEntity extends LineItemAdjustmentLine = LineItemAdjustmentLine
> {
  protected readonly lineItemAdjustmentRepository_: DAL.RepositoryService
  protected readonly cartService_: CartService

  constructor({
    lineItemAdjustmentRepository,
    cartService,
  }: InjectedDependencies) {
    this.lineItemAdjustmentRepository_ = lineItemAdjustmentRepository
    this.cartService_ = cartService
  }

  @InjectManager("lineItemAdjustmentRepository_")
  async retrieve(
    id: string,
    config: FindConfig<LineItemAdjustmentLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      LineItemAdjustmentLine,
      LineItemAdjustmentLineDTO
    >({
      id: id,
      entityName: Address.name,
      repository: this.lineItemAdjustmentRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("lineItemAdjustmentRepository_")
  async list(
    filters: any = {},
    config: FindConfig<LineItemAdjustmentLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<LineItemAdjustmentLine>(
      filters,
      config
    )

    return (await this.lineItemAdjustmentRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("lineItemAdjustmentRepository_")
  async listAndCount(
    filters: any = {},
    config: FindConfig<LineItemAdjustmentLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<LineItemAdjustmentLine>(
      filters,
      config
    )

    return (await this.lineItemAdjustmentRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("lineItemAdjustmentRepository_")
  async create(
    data: CreateLineItemAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.lineItemAdjustmentRepository_ as LineItemAdjustmentRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("lineItemAdjustmentRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.lineItemAdjustmentRepository_.delete(ids, sharedContext)
  }
}
