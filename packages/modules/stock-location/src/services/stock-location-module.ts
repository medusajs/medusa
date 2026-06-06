import {
  Context,
  CreateStockLocationInput,
  DAL,
  FilterableStockLocationProps,
  IEventBusService,
  InferEntityType,
  InternalModuleDeclaration,
  IStockLocationService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  StockLocationAddressInput,
  StockLocationTypes,
  UpdateStockLocationAddressInput,
  UpdateStockLocationInput,
  UpsertStockLocationAddressInput,
  UpsertStockLocationInput,
} from "@zjedene-medusa/framework/types"
import {
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isString,
  MedusaContext,
  MedusaService,
  Modules,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
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
  protected readonly stockLocationService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof StockLocation>
  >
  protected readonly stockLocationAddressService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof StockLocationAddress>
  >

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
  // @ts-expect-error
  createStockLocations(
    data: CreateStockLocationInput[],
    context: Context
  ): Promise<StockLocationTypes.StockLocationDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
    >(created)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  async createStockLocations_(
    data: CreateStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InferEntityType<typeof StockLocation>[]> {
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
  @EmitEvents()
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

    const operations: Promise<
      | InferEntityType<typeof StockLocation>[]
      | InferEntityType<typeof StockLocation>
    >[] = []

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
  // @ts-expect-error
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
  @EmitEvents()
  // @ts-expect-error
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
    >(updated)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  async updateStockLocations_(
    data:
      | UpdateStockLocationInput[]
      | UpdateStockLocationInput
      | { data: any; selector: FilterableStockLocationProps },
    @MedusaContext() context: Context = {}
  ): Promise<
    | InferEntityType<typeof StockLocation>[]
    | InferEntityType<typeof StockLocation>
  > {
    return await this.stockLocationService_.update(data, context)
  }

  // @ts-expect-error
  updateStockLocationAddresses(
    data: StockLocationAddressInput & { id: string },
    context?: Context
  ): Promise<StockLocationTypes.StockLocationAddressDTO>
  // @ts-expect-error
  updateStockLocationAddresses(
    data: (StockLocationAddressInput & { id: string })[],
    context?: Context
  ): Promise<StockLocationTypes.StockLocationAddressDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
    >(updated)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  private async updateStockLocationAddresses_(
    input: (StockLocationAddressInput & { id: string })[],
    @MedusaContext() context: Context
  ) {
    return await this.stockLocationAddressService_.update(input, context)
  }

  async upsertStockLocationAddresses(
    data: UpsertStockLocationAddressInput,
    context?: Context
  ): Promise<StockLocationTypes.StockLocationAddressDTO>
  async upsertStockLocationAddresses(
    data: UpsertStockLocationAddressInput[],
    context?: Context
  ): Promise<StockLocationTypes.StockLocationAddressDTO[]>

  @InjectManager()
  @EmitEvents()
  async upsertStockLocationAddresses(
    data: UpsertStockLocationAddressInput | UpsertStockLocationAddressInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    | StockLocationTypes.StockLocationAddressDTO
    | StockLocationTypes.StockLocationAddressDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.upsertStockLocationAddresses_(input, context)

    return await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationAddressDTO[]
      | StockLocationTypes.StockLocationAddressDTO
    >(Array.isArray(data) ? result : result[0])
  }

  @InjectTransactionManager()
  async upsertStockLocationAddresses_(
    input: UpsertStockLocationAddressInput[],
    @MedusaContext() context: Context = {}
  ) {
    const toUpdate = input.filter(
      (location): location is UpdateStockLocationAddressInput => !!location.id
    ) as UpdateStockLocationAddressInput[]
    const toCreate = input.filter(
      (location) => !location.id
    ) as StockLocationAddressInput[]

    const operations: Promise<
      | InferEntityType<typeof StockLocationAddress>[]
      | InferEntityType<typeof StockLocationAddress>
    >[] = []

    if (toCreate.length) {
      operations.push(
        this.stockLocationAddressService_.create(toCreate, context)
      )
    }
    if (toUpdate.length) {
      operations.push(
        this.stockLocationAddressService_.update(toUpdate, context)
      )
    }

    return (await promiseAll(operations)).flat()
  }
}
