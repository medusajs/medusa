import {
  Context,
  DAL,
  FilterableSalesChannelProps,
  FindConfig,
  SalesChannelDTO,
} from "@medusajs/types"
import {
  doNotForceTransaction,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
  shouldForceTransaction,
} from "@medusajs/utils"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types"

import { SalesChannel } from "@models"
import { SalesChannelRepository } from "@repositories"

type InjectedDependencies = {
  salesChannelRepository: DAL.RepositoryService
}

export default class SalesChannelService<
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
  ): Promise<SalesChannelDTO[]> {
    return (await (
      this.salesChannelRepository_ as SalesChannelRepository
    ).create(data, sharedContext)) as unknown as SalesChannelDTO[]
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
  ): Promise<SalesChannelDTO[]> {
    return (await (
      this.salesChannelRepository_ as SalesChannelRepository
    ).update(data, sharedContext)) as unknown as SalesChannelDTO[]
  }

  @InjectManager("salesChannelRepository_")
  async retrieve(
    salesChannelId: string,
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO> {
    return (await retrieveEntity<SalesChannel, SalesChannelDTO>({
      id: salesChannelId,
      entityName: SalesChannel.name,
      repository: this.salesChannelRepository_,
      config,
      sharedContext,
    })) as unknown as SalesChannelDTO
  }

  @InjectManager("salesChannelRepository_")
  async list(
    filters: {} = {},
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<SalesChannel>(
      filters,
      config
    )

    return (await this.salesChannelRepository_.find(
      queryOptions,
      sharedContext
    )) as unknown as SalesChannelDTO[]
  }

  @InjectManager("salesChannelRepository_")
  async listAndCount(
    filters: FilterableSalesChannelProps = {},
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[SalesChannelDTO[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<SalesChannel>(
      filters,
      config
    )

    return (await (
      this.salesChannelRepository_ as SalesChannelRepository
    ).findAndCount(queryOptions, sharedContext)) as unknown as [
      SalesChannelDTO[],
      number
    ]
  }
}
