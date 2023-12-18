import { Context, DAL, FindConfig, SalesChannelDTO } from "@medusajs/types"
import {
  doNotForceTransaction,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
  shouldForceTransaction,
} from "@medusajs/utils"

import { SalesChannel } from "@models"
import { SalesChannelRepository } from "@repositories"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "@types"

type InjectedDependencies = {
  salesChannelRepository: DAL.RepositoryService
}

export default class SalesChannelModuleService<
  TEntity extends SalesChannel = SalesChannel
> {
  protected readonly salesChannelRepository_: DAL.RepositoryService

  constructor({ salesChannelRepository }: InjectedDependencies) {
    this.salesChannelRepository_ = salesChannelRepository
  }

  @InjectTransactionManager(shouldForceTransaction, "salesChannelRepository_")
  async create(
    data: CreateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.salesChannelRepository_ as SalesChannelRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "salesChannelRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await (this.salesChannelRepository_ as SalesChannelRepository).delete(
      ids,
      sharedContext
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "salesChannelRepository_")
  async update(
    data: UpdateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.salesChannelRepository_ as SalesChannelRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectManager("salesChannelRepository_")
  async retrieve(
    salesChannelId: string,
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<SalesChannel, SalesChannelDTO>({
      id: salesChannelId,
      entityName: SalesChannel.name,
      repository: this.salesChannelRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("salesChannelRepository_")
  async list(
    filters: {} = {},
    config: FindConfig<{}> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<SalesChannel>(
      filters,
      config
    )

    return (await this.salesChannelRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  // @InjectManager("salesChannelRepository_")
  // async listAndCount(
  //   filters: FilterableSalesChannelProps = {},
  //   config: FindConfig<FilterableSalesChannelProps> = {},
  //   @MedusaContext() sharedContext: Context = {}
  // ): Promise<[TEntity[], number]> {
  //   const queryOptions = ModulesSdkUtils.buildQuery<SalesChannel>(
  //     filters,
  //     config
  //   )
  //
  //   return (await this.salesChannelRepository_.findAndCount(
  //     queryOptions,
  //     sharedContext
  //   )) as [TEntity[], number]
  // }
}
