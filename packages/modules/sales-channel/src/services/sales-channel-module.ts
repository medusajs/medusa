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
  UpsertSalesChannelDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  isString,
  MedusaContext,
  MedusaService,
  promiseAll,
} from "@medusajs/utils"

import { SalesChannel } from "@models"
import { UpdateSalesChanneInput } from "@types"
import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  salesChannelService: ModulesSdkTypes.IMedusaInternalService<any>
}

export default class SalesChannelModuleService
  extends MedusaService<{ SalesChannel: { dto: SalesChannelDTO } }>({
    SalesChannel,
  })
  implements ISalesChannelModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly salesChannelService_: ModulesSdkTypes.IMedusaInternalService<SalesChannel>

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

  // @ts-expect-error
  async createSalesChannels(
    data: CreateSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>
  async createSalesChannels(
    data: CreateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>

  @InjectManager("baseRepository_")
  async createSalesChannels(
    data: CreateSalesChannelDTO | CreateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO | SalesChannelDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.createSalesChannels_(input, sharedContext)

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async createSalesChannels_(
    data: CreateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<SalesChannel[]> {
    return await this.salesChannelService_.create(data, sharedContext)
  }

  // @ts-expect-error
  async updateSalesChannels(
    id: string,
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>
  async updateSalesChannels(
    selector: FilterableSalesChannelProps,
    data: UpdateSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>

  @InjectManager("baseRepository_")
  async updateSalesChannels(
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

    const result = await this.updateSalesChannels_(
      normalizedInput,
      sharedContext
    )

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async updateSalesChannels_(
    data: UpdateSalesChannelDTO[],
    sharedContext: Context
  ) {
    return await this.salesChannelService_.update(data, sharedContext)
  }

  async upsertSalesChannels(
    data: UpsertSalesChannelDTO[],
    sharedContext?: Context
  ): Promise<SalesChannelDTO[]>
  async upsertSalesChannels(
    data: UpsertSalesChannelDTO,
    sharedContext?: Context
  ): Promise<SalesChannelDTO>
  @InjectTransactionManager("baseRepository_")
  async upsertSalesChannels(
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
      operations.push(this.createSalesChannels_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.updateSalesChannels_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()
    return await this.baseRepository_.serialize<
      SalesChannelDTO[] | SalesChannelDTO
    >(Array.isArray(data) ? result : result[0])
  }
}
