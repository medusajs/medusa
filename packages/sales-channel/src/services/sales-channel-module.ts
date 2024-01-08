import {
  Context,
  DAL,
  FilterableSalesChannelProps,
  FindConfig,
  InternalModuleDeclaration,
  ISalesChannelModuleService,
  ModuleJoinerConfig,
  SalesChannelDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types"

import { SalesChannel } from "@models"

import { joinerConfig } from "../joiner-config"
import SalesChannelService from "./sales-channel"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  salesChannelService: SalesChannelService<any>
}

export default class SalesChannelModuleService<
  TEntity extends SalesChannel = SalesChannel
> implements ISalesChannelModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly salesChannelService_: SalesChannelService<TEntity>

  constructor(
    { baseRepository, salesChannelService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.salesChannelService_ = salesChannelService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectTransactionManager("baseRepository_")
  async create(
    data: CreateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO[]> {
    const salesChannel = await this.salesChannelService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      salesChannel,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.salesChannelService_.delete(ids, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async update(
    data: UpdateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO[]> {
    const salesChannel = await this.salesChannelService_.update(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      salesChannel,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async retrieve(
    salesChannelId: string,
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO> {
    const salesChannel = await this.salesChannelService_.retrieve(
      salesChannelId,
      config
    )

    return await this.baseRepository_.serialize<SalesChannelDTO>(salesChannel, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async list(
    filters: {} = {},
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO[]> {
    const salesChannels = await this.salesChannelService_.list(filters, config)

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      salesChannels,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: FilterableSalesChannelProps = {},
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[SalesChannelDTO[], number]> {
    const [salesChannels, count] = await this.salesChannelService_.listAndCount(
      filters,
      config
    )

    return [
      await this.baseRepository_.serialize<SalesChannelDTO[]>(salesChannels, {
        populate: true,
      }),
      count,
    ]
  }
}
