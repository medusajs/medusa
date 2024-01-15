import {
  Context,
  DAL,
  FilterableSalesChannelProps,
  FindConfig,
  InternalModuleDeclaration,
  ISalesChannelModuleService,
  ModuleJoinerConfig,
  RestoreReturn,
  SalesChannelDTO,
  SoftDeleteReturn,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  mapObjectTo,
  MedusaContext,
} from "@medusajs/utils"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types"

import { SalesChannel } from "@models"

import SalesChannelService from "./sales-channel"
import {
  joinerConfig,
  entityNameToLinkableKeysMap,
  LinkableKeys,
} from "../joiner-config"

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

  async create(
    data: CreateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  async create(
    data: CreateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  @InjectTransactionManager("baseRepository_")
  async create(
    data: CreateSalesChannelDTO | CreateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.salesChannelService_.create(input, sharedContext)

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  async delete(ids: string[], sharedContext?: Context): Promise<void>

  async delete(id: string, sharedContext?: Context): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async delete(
    ids: string | string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const salesChannelIds = Array.isArray(ids) ? ids : [ids]
    await this.salesChannelService_.delete(salesChannelIds, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async softDelete_(
    salesChannelIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    return await this.salesChannelService_.softDelete(
      salesChannelIds,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async softDelete<
    TReturnableLinkableKeys extends string = Lowercase<
      keyof typeof LinkableKeys
    >
  >(
    salesChannelIds: string[],
    { returnLinkableKeys }: SoftDeleteReturn<TReturnableLinkableKeys> = {},
    sharedContext: Context = {}
  ): Promise<Record<Lowercase<keyof typeof LinkableKeys>, string[]> | void> {
    const [_, cascadedEntitiesMap] = await this.softDelete_(
      salesChannelIds,
      sharedContext
    )

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      mappedCascadedEntitiesMap = mapObjectTo<
        Record<Lowercase<keyof typeof LinkableKeys>, string[]>
      >(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
        pick: returnLinkableKeys,
      })
    }

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager("baseRepository_")
  async restore_(
    salesChannelIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    return await this.salesChannelService_.restore(
      salesChannelIds,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async restore<
    TReturnableLinkableKeys extends string = Lowercase<
      keyof typeof LinkableKeys
    >
  >(
    salesChannelIds: string[],
    { returnLinkableKeys }: RestoreReturn<TReturnableLinkableKeys> = {},
    sharedContext: Context = {}
  ): Promise<Record<Lowercase<keyof typeof LinkableKeys>, string[]> | void> {
    const [_, cascadedEntitiesMap] = await this.restore_(
      salesChannelIds,
      sharedContext
    )

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      mappedCascadedEntitiesMap = mapObjectTo<
        Record<Lowercase<keyof typeof LinkableKeys>, string[]>
      >(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
        pick: returnLinkableKeys,
      })
    }

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  async update(
    data: UpdateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  async update(
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  @InjectTransactionManager("baseRepository_")
  async update(
    data: UpdateSalesChannelDTO | UpdateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.salesChannelService_.update(input, sharedContext)

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      Array.isArray(data) ? result : result[0],
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
