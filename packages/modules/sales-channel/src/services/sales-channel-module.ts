import {
  Context,
  CreateSalesChannelDTO,
  DAL,
  FilterableSalesChannelProps,
  InternalModuleDeclaration,
  ISalesChannelModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  SalesChannelDTO,
  UpdateSalesChannelDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  isString,
  MedusaContext,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"

import { SalesChannel } from "@models"

import { UpsertSalesChannelDTO } from "@medusajs/types"
import { UpdateSalesChanneInput } from "@types"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  salesChannelService: ModulesSdkTypes.InternalModuleService<any>
}

export default class SalesChannelModuleService<
    TEntity extends SalesChannel = SalesChannel
  >
  extends ModulesSdkUtils.MedusaService<SalesChannelDTO>(
    SalesChannel,
    {},
    entityNameToLinkableKeysMap
  )
  implements ISalesChannelModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly salesChannelService_: ModulesSdkTypes.InternalModuleService<TEntity>

  constructor(
    { baseRepository, salesChannelService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)
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
  @InjectManager("baseRepository_")
  async create(
    data: CreateSalesChannelDTO | CreateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.create_(input, sharedContext)

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async create_(
    data: CreateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<SalesChannel[]> {
    return await this.salesChannelService_.create(data, sharedContext)
  }

  async update(
    id: string,
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>
  async update(
    selector: FilterableSalesChannelProps,
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>
  @InjectManager("baseRepository_")
  async update(
    idOrSelector: string | FilterableSalesChannelProps,
    data: UpdateSalesChannelDTO | UpdateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    let normalizedInput: UpdateSalesChanneInput[] = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const channels = await this.salesChannelService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = channels.map((channel) => ({
        id: channel.id,
        ...data,
      }))
    }

    const result = await this.update_(normalizedInput, sharedContext)

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async update_(data: UpdateSalesChannelDTO[], sharedContext: Context) {
    return await this.salesChannelService_.update(data, sharedContext)
  }

  async upsert(
    data: UpsertSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>
  async upsert(
    data: UpsertSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>
  @InjectTransactionManager("baseRepository_")
  async upsert(
    data: UpsertSalesChannelDTO | UpsertSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (channel): channel is UpdateSalesChannelDTO => !!channel.id
    )
    const forCreate = input.filter(
      (channel): channel is CreateSalesChannelDTO => !channel.id
    )

    const operations: Promise<SalesChannel[]>[] = []

    if (forCreate.length) {
      operations.push(this.create_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.update_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()
    return await this.baseRepository_.serialize<
      SalesChannelDTO[] | SalesChannelDTO
    >(Array.isArray(data) ? result : result[0])
  }
}
