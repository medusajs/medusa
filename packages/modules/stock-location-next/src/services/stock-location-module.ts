import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  Context,
  CreateStockLocationInput,
  IEventBusService,
  ModuleJoinerConfig,
  StockLocationAddressInput,
  StockLocationTypes,
  ModulesSdkTypes,
  DAL,
  IStockLocationServiceNext,
  FilterableStockLocationProps,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  isString,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { StockLocation, StockLocationAddress } from "../models"
import { UpdateStockLocationNextInput } from "@medusajs/types"
import { UpsertStockLocationInput } from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"

type InjectedDependencies = {
  eventBusModuleService: IEventBusService
  baseRepository: DAL.RepositoryService
  stockLocationService: ModulesSdkTypes.InternalModuleService<any>
  stockLocationAddressService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [StockLocationAddress]

/**
 * Service for managing stock locations.
 */

export default class StockLocationModuleService<
    TEntity extends StockLocation = StockLocation,
    TStockLocationAddress extends StockLocationAddress = StockLocationAddress
  >
  extends ModulesSdkUtils.MedusaService<
    InjectedDependencies,
    StockLocationTypes.StockLocationDTO,
    {
      StockLocation: { dto: StockLocationTypes.StockLocationDTO }
      StockLocationAddress: { dto: StockLocationTypes.StockLocationAddressDTO }
    }
  >(StockLocation, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IStockLocationServiceNext
{
  protected readonly eventBusModuleService_: IEventBusService
  protected baseRepository_: DAL.RepositoryService
  protected readonly stockLocationService_: ModulesSdkTypes.InternalModuleService<TEntity>
  protected readonly stockLocationAddressService_: ModulesSdkTypes.InternalModuleService<TStockLocationAddress>

  constructor(
    {
      eventBusModuleService,
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

  create(
    data: CreateStockLocationInput,
    context: Context
  ): Promise<StockLocationTypes.StockLocationDTO>
  create(
    data: CreateStockLocationInput[],
    context: Context
  ): Promise<StockLocationTypes.StockLocationDTO[]>

  /**
   * Creates a new stock location.
   * @param data - The input data for creating a Stock Location.
   * @param context
   * @returns The created stock location.
   */
  @InjectManager("baseRepository_")
  async create(
    data: CreateStockLocationInput | CreateStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    StockLocationTypes.StockLocationDTO | StockLocationTypes.StockLocationDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const created = await this.create_(input, context)

    const serialized = await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationDTO
      | StockLocationTypes.StockLocationDTO[]
    >(created, { populate: true })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  async create_(
    data: CreateStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<TEntity[]> {
    return await this.stockLocationService_.create(data, context)
  }

  async upsert(
    data: UpsertStockLocationInput,
    context?: Context
  ): Promise<StockLocationTypes.StockLocationDTO>
  async upsert(
    data: UpsertStockLocationInput[],
    context?: Context
  ): Promise<StockLocationTypes.StockLocationDTO[]>

  @InjectManager("baseRepository_")
  async upsert(
    data: UpsertStockLocationInput | UpsertStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    StockLocationTypes.StockLocationDTO | StockLocationTypes.StockLocationDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const result = await this.upsert_(input, context)

    return await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationDTO[]
      | StockLocationTypes.StockLocationDTO
    >(Array.isArray(data) ? result : result[0])
  }

  @InjectTransactionManager("baseRepository_")
  async upsert_(
    input: UpsertStockLocationInput[],
    @MedusaContext() context: Context = {}
  ) {
    const toUpdate = input.filter(
      (location): location is UpdateStockLocationNextInput => !!location.id
    ) as UpdateStockLocationNextInput[]
    const toCreate = input.filter(
      (location) => !location.id
    ) as CreateStockLocationInput[]

    const operations: Promise<StockLocation[] | StockLocation>[] = []

    if (toCreate.length) {
      operations.push(this.create_(toCreate, context))
    }
    if (toUpdate.length) {
      operations.push(this.update_(toUpdate, context))
    }

    return (await promiseAll(operations)).flat()
  }

  update(
    id: string,
    input: UpdateStockLocationNextInput,
    context?: Context
  ): Promise<StockLocationTypes.StockLocationDTO>
  update(
    selector: FilterableStockLocationProps,
    input: UpdateStockLocationNextInput,
    context?: Context
  ): Promise<StockLocationTypes.StockLocationDTO[]>
  /**
   * Updates an existing stock location.
   * @param stockLocationId - The ID of the stock location to update.
   * @param updateData - The update data for the stock location.
   * @param context
   * @returns The updated stock location.
   */
  @InjectManager("baseRepository_")
  async update(
    idOrSelector: string | FilterableStockLocationProps,
    data: UpdateStockLocationNextInput | UpdateStockLocationNextInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    StockLocationTypes.StockLocationDTO | StockLocationTypes.StockLocationDTO[]
  > {
    let normalizedInput:
      | (UpdateStockLocationNextInput & { id: string })[]
      | { data: any; selector: FilterableStockLocationProps } = []
    if (isString(idOrSelector)) {
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      normalizedInput = { data, selector: idOrSelector }
    }
    const updated = await this.update_(normalizedInput, context)

    const serialized = await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationDTO
      | StockLocationTypes.StockLocationDTO[]
    >(updated, { populate: true })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  async update_(
    data:
      | UpdateStockLocationNextInput[]
      | UpdateStockLocationNextInput
      | { data: any; selector: FilterableStockLocationProps },
    @MedusaContext() context: Context = {}
  ): Promise<TEntity[] | TEntity> {
    return await this.stockLocationService_.update(data, context)
  }

  updateStockLocationAddress(
    data: StockLocationAddressInput & { id: string },
    context?: Context
  ): Promise<StockLocationTypes.StockLocationAddressDTO>
  updateStockLocationAddress(
    data: (StockLocationAddressInput & { id: string })[],
    context?: Context
  ): Promise<StockLocationTypes.StockLocationAddressDTO[]>

  @InjectManager("baseRepository_")
  async updateStockLocationAddress(
    data:
      | (StockLocationAddressInput & { id: string })
      | (StockLocationAddressInput & { id: string })[],
    @MedusaContext() context: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]

    const updated = await this.updateStockLocationAddress_(input, context)

    const serialized = await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationAddressDTO
      | StockLocationTypes.StockLocationAddressDTO[]
    >(updated, { populate: true })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  private async updateStockLocationAddress_(
    input: (StockLocationAddressInput & { id: string })[],
    @MedusaContext() context: Context
  ) {
    return await this.stockLocationAddressService_.update(input, context)
  }
}
