import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  Context,
  CreateStockLocationInput,
  IEventBusService,
  MODULE_RESOURCE_TYPE,
  ModuleJoinerConfig,
  StockLocationAddressInput,
  StockLocationTypes,
  UpdateStockLocationInput,
  ModulesSdkTypes,
  DAL,
} from "@medusajs/types"
import {
  InjectEntityManager,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  setMetadata,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { StockLocation, StockLocationAddress } from "../models"

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
> extends ModulesSdkUtils.abstractModuleServiceFactory<
  InjectedDependencies,
  StockLocationTypes.StockLocationDTO,
  {
    StockLocation: { dto: StockLocationTypes.StockLocationDTO }
    StockLocationAddress: { dto: StockLocationTypes.StockLocationAddressDTO }
  }
>(StockLocation, generateMethodForModels, entityNameToLinkableKeysMap) {
  // static Events = {
  //   CREATED: "stock-location.created",
  //   UPDATED: "stock-location.updated",
  //   DELETED: "stock-location.deleted",
  // }

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

  // /**
  //  * Lists all stock locations that match the given selector.
  //  * @param selector - Properties to filter by.
  //  * @param config - Additional configuration for the query.
  //  * @param context
  //  * @return A list of stock locations.
  //  */
  // async list(
  //   selector: FilterableStockLocationProps = {},
  //   config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 },
  //   @MedusaContext() context: Context = {}
  // ): Promise<StockLocation[]> {
  //   const [locations] = await this.listAndCount(selector, config, context)
  //   return locations
  // }

  // /**
  //  * Lists all stock locations that match the given selector and returns the count of matching stock locations.
  //  * @param selector - Properties to filter by.
  //  * @param config - Additional configuration for the query.
  //  * @param context
  //  * @return A list of stock locations and the count of matching stock locations.
  //  */
  // async listAndCount(
  //   selector: FilterableStockLocationProps = {},
  //   config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 },
  //   @MedusaContext() context: Context = {}
  // ): Promise<[StockLocation[], number]> {
  //   const manager = context.transactionManager ?? this.manager_
  //   const locationRepo = manager.getRepository(StockLocation)
  //   // let q
  //   // if (selector.q) {
  //   //   q = selector.q
  //   //   delete selector.q
  //   // }

  //   // // const query = buildQuery(selector, config)

  //   // if (q) {
  //   //   const where = query.where as FindOptionsWhere<StockLocation>

  //   //   delete where.name

  //   //   query.where = [
  //   //     {
  //   //       ...where,
  //   //       name: ILike(`%${q}%`),
  //   //     },
  //   //   ]
  //   // }

  //   return await locationRepo.findAndCount({})
  // }

  // /**
  //  * Retrieves a Stock Location by its ID.
  //  * @param stockLocationId - The ID of the stock location.
  //  * @param config - Additional configuration for the query.
  //  * @param context
  //  * @return The stock location.
  //  * @throws If the stock location ID is not definedor the stock location with the given ID was not found.
  //  */
  // async retrieve(
  //   stockLocationId: string,
  //   config: FindConfig<StockLocation> = {},
  //   @MedusaContext() context: SharedContext = {}
  // ): Promise<StockLocation> {
  //   if (!isDefined(stockLocationId)) {
  //     throw new MedusaError(
  //       MedusaError.Types.NOT_FOUND,
  //       `"stockLocationId" must be defined`
  //     )
  //   }

  //   const manager = context.transactionManager ?? this.manager_
  //   const locationRepo = manager.getRepository(StockLocation)

  //   // const query = buildQuery({ id: stockLocationId }, config)
  //   const [loc] = await locationRepo.find({ where: { id: stockLocationId } })

  //   if (!loc) {
  //     throw new MedusaError(
  //       MedusaError.Types.NOT_FOUND,
  //       `StockLocation with id ${stockLocationId} was not found`
  //     )
  //   }

  //   return loc
  // }

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

  update(
    data: UpdateStockLocationInput & { id: string },
    context: Context
  ): Promise<StockLocationTypes.StockLocationDTO>
  update(
    data: (UpdateStockLocationInput & { id: string })[],
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
    data:
      | (UpdateStockLocationInput & { id: string })
      | (UpdateStockLocationInput & { id: string })[],
    @MedusaContext() context: Context = {}
  ): Promise<
    StockLocationTypes.StockLocationDTO | StockLocationTypes.StockLocationDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const updated = await this.update_(input, context)

    const serialized = await this.baseRepository_.serialize<
      | StockLocationTypes.StockLocationDTO
      | StockLocationTypes.StockLocationDTO[]
    >(updated, { populate: true })

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
