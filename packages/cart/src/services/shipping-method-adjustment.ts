import {
  Context,
  CreateShippingMethodAdjustmentDTO,
  DAL,
  FindConfig,
  ShippingMethodAdjustmentLineDTO,
  UpdateShippingMethodAdjustmentDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { ShippingMethodAdjustmentLine } from "@models"
import CartService from "./cart"

type InjectedDependencies = {
  shippingMethodAdjustmentRepository: DAL.RepositoryService
  cartService: CartService
}

export default class ShippingAdjustmentService<
  TEntity extends ShippingMethodAdjustmentLine = ShippingMethodAdjustmentLine
> {
  protected readonly shippingMethodAdjustmentRepository_: DAL.RepositoryService
  protected readonly cartService_: CartService

  constructor({
    shippingMethodAdjustmentRepository,
    cartService,
  }: InjectedDependencies) {
    this.shippingMethodAdjustmentRepository_ =
      shippingMethodAdjustmentRepository
    this.cartService_ = cartService
  }

  @InjectManager("shippingMethodAdjustmentRepository_")
  async retrieve(
    id: string,
    config: FindConfig<ShippingMethodAdjustmentLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      ShippingMethodAdjustmentLine,
      ShippingMethodAdjustmentLineDTO
    >({
      id: id,
      entityName: ShippingMethodAdjustmentLine.name,
      repository: this.shippingMethodAdjustmentRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("shippingMethodAdjustmentRepository_")
  async list(
    filters: any = {},
    config: FindConfig<ShippingMethodAdjustmentLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions =
      ModulesSdkUtils.buildQuery<ShippingMethodAdjustmentLine>(filters, config)

    return (await this.shippingMethodAdjustmentRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("shippingMethodAdjustmentRepository_")
  async listAndCount(
    filters: any = {},
    config: FindConfig<ShippingMethodAdjustmentLineDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions =
      ModulesSdkUtils.buildQuery<ShippingMethodAdjustmentLine>(filters, config)

    return (await this.shippingMethodAdjustmentRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("shippingMethodAdjustmentRepository_")
  async create(
    data: CreateShippingMethodAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.shippingMethodAdjustmentRepository_.create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("shippingMethodAdjustmentRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.shippingMethodAdjustmentRepository_.delete(ids, sharedContext)
  }

  @InjectTransactionManager("shippingMethodAdjustmentRepository_")
  async update(
    data: UpdateShippingMethodAdjustmentDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.shippingMethodAdjustmentRepository_.update(data, sharedContext)
  }
}
