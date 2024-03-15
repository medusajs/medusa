import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  Context,
  CreateStockLocationInput,
  IEventBusService,
  ModuleJoinerConfig,
  StockLocationAddressInput,
  StockLocationTypes,
  UpdateStockLocationInput,
  ModulesSdkTypes,
  DAL,
  IStockLocationServiceNext,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { StockLocation, StockLocationAddress } from "../models"
import { UpdateStockLocationNextInput } from "@medusajs/types"

type InjectedDependencies = {
  eventBusService: IEventBusService
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
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    StockLocationTypes.StockLocationDTO,
    {
      StockLocation: { dto: StockLocationTypes.StockLocationDTO }
      StockLocationAddress: { dto: StockLocationTypes.StockLocationAddressDTO }
    }
  >(StockLocation, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IStockLocationServiceNext
{
  protected readonly eventBusService_: IEventBusService
  protected baseRepository_: DAL.RepositoryService
  protected readonly stockLocationService_: ModulesSdkTypes.InternalModuleService<TEntity>
  protected readonly stockLocationAddressService_: ModulesSdkTypes.InternalModuleService<TStockLocationAddress>

  constructor(
    {
      eventBusService,
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
    this.eventBusService_ = eventBusService
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
    >(created, { populate: "*" })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  async create_(
    data: CreateStockLocationInput[],
    @MedusaContext() context: Context = {}
  ): Promise<TEntity[]> {
    return await this.stockLocationService_.create(data, context)
  }

  update(
    data: UpdateStockLocationNextInput,
    context: Context
  ): Promise<StockLocationTypes.StockLocationDTO>
  update(
    data: UpdateStockLocationNextInput[],
    context: Context
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
    data: UpdateStockLocationNextInput | UpdateStockLocationNextInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    StockLocationTypes.StockLocationDTO | StockLocationTypes.StockLocationDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const updated = await this.update_(input, context)

    const serialized = await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationDTO
      | StockLocationTypes.StockLocationDTO[]
    >(updated, { populate: "*" })

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  async update_(
    data: (UpdateStockLocationInput & { id: string })[],
    @MedusaContext() context: Context = {}
  ): Promise<TEntity[]> {
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
    >(updated, { populate: "*" })

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
