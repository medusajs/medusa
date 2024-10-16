import {
  Context,
  CreateStockLocationInput,
  DAL,
  FilterableStockLocationProps,
  IEventBusService,
  InternalModuleDeclaration,
  IStockLocationService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  StockLocationAddressInput,
  StockLocationTypes,
  UpdateStockLocationInput,
  UpsertStockLocationInput,
} from "@medusajs/framework/types"
import {
  InjectManager,
  InjectTransactionManager,
  isString,
  MedusaContext,
  MedusaService,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import { joinerConfig } from "../joiner-config"
import { StockLocation, StockLocationAddress } from "../models"

type InjectedDependencies = {
  [Modules.EVENT_BUS]: IEventBusService
  baseRepository: DAL.RepositoryService
  stockLocationService: ModulesSdkTypes.IMedusaInternalService<any>
  stockLocationAddressService: ModulesSdkTypes.IMedusaInternalService<any>
}

/**
 * Service for managing stock locations.
 */
export default class StockLocationModuleService
  extends MedusaService<{
    StockLocation: { dto: StockLocationTypes.StockLocationDTO }
    StockLocationAddress: { dto: StockLocationTypes.StockLocationAddressDTO }
  }>({ StockLocation, StockLocationAddress })
  implements IStockLocationService
{
  protected readonly eventBusModuleService_: IEventBusService
  protected baseRepository_: DAL.RepositoryService
  protected readonly stockLocationService_: ModulesSdkTypes.IMedusaInternalService<StockLocation>
  protected readonly stockLocationAddressService_: ModulesSdkTypes.IMedusaInternalService<StockLocationAddress>

  constructor(
    {
      [Modules.EVENT_BUS]: eventBusModuleService,
      baseRepository,
      stockLocationService,
      stockLocationAddressService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration?: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.stockLocationService_ = stockLocationService
    this.stockLocationAddressService_ = stockLocationAddressService
    this.eventBusModuleService_ = eventBusModuleService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  // @ts-expect-error
  createStockLocations(
    data: CreateStockLocationInput,
    context: Context
  ): Promise<StockLocationTypes.StockLocationDTO>
  createStockLocations(
    data: CreateStockLocationInput[],
    context: Context
  ): Promise<StockLocationTypes.StockLocationDTO[]>

  @InjectManager()
  async createStockLocations(
    data: CreateStockLocationInput | CreateStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    StockLocationTypes.StockLocationDTO | StockLocationTypes.StockLocationDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const created = await this.createStockLocations_(input, context)

    const serialized = await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationDTO
      | StockLocationTypes.StockLocationDTO[]
    >(created, { populate: true })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  async createStockLocations_(
    data: CreateStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<StockLocation[]> {
    return await this.stockLocationService_.create(data, context)
  }

  async upsertStockLocations(
    data: UpsertStockLocationInput,
    context?: Context
  ): Promise<StockLocationTypes.StockLocationDTO>
  async upsertStockLocations(
    data: UpsertStockLocationInput[],
    context?: Context
  ): Promise<StockLocationTypes.StockLocationDTO[]>

  @InjectManager()
  async upsertStockLocations(
    data: UpsertStockLocationInput | UpsertStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    StockLocationTypes.StockLocationDTO | StockLocationTypes.StockLocationDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.upsertStockLocations_(input, context)

    return await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationDTO[]
      | StockLocationTypes.StockLocationDTO
    >(Array.isArray(data) ? result : result[0])
  }

  @InjectTransactionManager()
  async upsertStockLocations_(
    input: UpsertStockLocationInput[],
    @MedusaContext() context: Context = {}
  ) {
    const toUpdate = input.filter(
      (location): location is UpdateStockLocationInput => !!location.id
    ) as UpdateStockLocationInput[]
    const toCreate = input.filter(
      (location) => !location.id
    ) as CreateStockLocationInput[]

    const operations: Promise<StockLocation[] | StockLocation>[] = []

    if (toCreate.length) {
      operations.push(this.createStockLocations_(toCreate, context))
    }
    if (toUpdate.length) {
      operations.push(this.updateStockLocations_(toUpdate, context))
    }

    return (await promiseAll(operations)).flat()
  }

  // @ts-expect-error
  updateStockLocations(
    id: string,
    input: UpdateStockLocationInput,
    context?: Context
  ): Promise<StockLocationTypes.StockLocationDTO>
  updateStockLocations(
    selector: FilterableStockLocationProps,
    input: UpdateStockLocationInput,
    context?: Context
  ): Promise<StockLocationTypes.StockLocationDTO[]>
  /**
   * Updates an existing stock location.
   * @param stockLocationId - The ID of the stock location to update.
   * @param updateData - The update data for the stock location.
   * @param context
   * @returns The updated stock location.
   */
  @InjectManager()
  async updateStockLocations(
    idOrSelector: string | FilterableStockLocationProps,
    data: UpdateStockLocationInput | UpdateStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    StockLocationTypes.StockLocationDTO | StockLocationTypes.StockLocationDTO[]
  > {
    let normalizedInput:
      | (UpdateStockLocationInput & { id: string })[]
      | { data: any; selector: FilterableStockLocationProps } = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      normalizedInput = { data, selector: idOrSelector }
    }
    const updated = await this.updateStockLocations_(normalizedInput, context)

    const serialized = await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationDTO
      | StockLocationTypes.StockLocationDTO[]
    >(updated, { populate: true })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  async updateStockLocations_(
    data:
      | UpdateStockLocationInput[]
      | UpdateStockLocationInput
      | { data: any; selector: FilterableStockLocationProps },
    @MedusaContext() context: Context = {}
  ): Promise<StockLocation[] | StockLocation> {
    return await this.stockLocationService_.update(data, context)
  }

  // @ts-expect-error
  updateStockLocationAddresses(
    data: StockLocationAddressInput & { id: string },
    context?: Context
  ): Promise<StockLocationTypes.StockLocationAddressDTO>
  updateStockLocationAddresses(
    data: (StockLocationAddressInput & { id: string })[],
    context?: Context
  ): Promise<StockLocationTypes.StockLocationAddressDTO[]>

  @InjectManager()
  async updateStockLocationAddresses(
    data:
      | (StockLocationAddressInput & { id: string })
      | (StockLocationAddressInput & { id: string })[],
    @MedusaContext() context: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]

    const updated = await this.updateStockLocationAddresses_(input, context)

    const serialized = await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationAddressDTO
      | StockLocationTypes.StockLocationAddressDTO[]
    >(updated, { populate: true })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  private async updateStockLocationAddresses_(
    input: (StockLocationAddressInput & { id: string })[],
    @MedusaContext() context: Context
  ) {
    return await this.stockLocationAddressService_.update(input, context)
  }
}
