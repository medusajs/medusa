import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  Context,
  CreateStockLocationInput,
  DAL,
  FilterableStockLocationProps,
  FindConfig,
  IEventBusService,
  JoinerServiceConfig,
  StockLocationAddressInput,
  UpdateStockLocationInput,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  isDefined,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  setMetadata,
} from "@medusajs/utils"
import { EntityManager } from "typeorm"
import { joinerConfig } from "../joiner-config"
import { StockLocation, StockLocationAddress } from "../models"
import { buildQuery } from "../utils/build-query"
import {
  StockLocationAddressRepository,
  StockLocationRepostiory,
} from "../repositories"
import { shouldForceTransaction } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: IEventBusService
  baseRepository: DAL.RepositoryService
  stockLocationRepository: StockLocationRepostiory
  stockLocationAddressRepository: StockLocationAddressRepository
}

/**
 * Service for managing stock locations.
 */

export default class StockLocationService {
  static Events = {
    CREATED: "stock-location.created",
    UPDATED: "stock-location.updated",
    DELETED: "stock-location.deleted",
  }

  protected readonly manager_: EntityManager
  protected readonly eventBusService_: IEventBusService
  protected baseRepository_: DAL.RepositoryService
  protected readonly stockLocationRepository_: StockLocationRepostiory
  // eslint-disable-next-line max-len
  protected readonly stockLocationAddressRepository_: StockLocationAddressRepository

  constructor(
    {
      eventBusService,
      manager,
      baseRepository,
      stockLocationRepository,
      stockLocationAddressRepository,
    }: InjectedDependencies,
    options?: unknown,
    protected readonly moduleDeclaration?: InternalModuleDeclaration
  ) {
    this.manager_ = manager
    this.eventBusService_ = eventBusService
    this.baseRepository_ = baseRepository
    this.stockLocationRepository_ = stockLocationRepository
    this.stockLocationAddressRepository_ = stockLocationAddressRepository
  }

  __joinerConfig(): JoinerServiceConfig {
    return joinerConfig
  }

  /**
   * Lists all stock locations that match the given selector.
   * @param selector - Properties to filter by.
   * @param config - Additional configuration for the query.
   * @param context
   * @return A list of stock locations.
   */
  async list(
    selector: FilterableStockLocationProps = {},
    config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 },
    context: Context = {}
  ): Promise<StockLocation[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<StockLocation>(
      selector,
      config
    )

    const locations = await this.stockLocationRepository_.find(
      queryOptions,
      context
    )

    const serialized = await this.baseRepository_.serialize<StockLocation[]>(
      locations,
      { populate: true }
    )

    return serialized
  }

  /**
   * Lists all stock locations that match the given selector and returns the count of matching stock locations.
   * @param selector - Properties to filter by.
   * @param config - Additional configuration for the query.
   * @param context
   * @return A list of stock locations and the count of matching stock locations.
   */
  async listAndCount(
    selector: FilterableStockLocationProps = {},
    config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 },
    context: Context = {}
  ): Promise<[StockLocation[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<StockLocation>(
      selector,
      config
    )

    const [locations, count] = await this.stockLocationRepository_.findAndCount(
      queryOptions,
      context
    )

    const serialized = await this.baseRepository_.serialize<StockLocation[]>(
      locations,
      { populate: true }
    )

    return [serialized, count]
  }

  /**
   * Retrieves a Stock Location by its ID.
   * @param stockLocationId - The ID of the stock location.
   * @param config - Additional configuration for the query.
   * @param context
   * @return The stock location.
   * @throws If the stock location ID is not definedor the stock location with the given ID was not found.
   */
  async retrieve(
    stockLocationId: string,
    config: FindConfig<StockLocation> = {},
    context: Context = {}
  ): Promise<StockLocation> {
    const loc = await this.retrieve_(stockLocationId, config, context)

    const serialized = await this.baseRepository_.serialize<StockLocation>(
      loc,
      { populate: true }
    )

    return serialized
  }

  protected async retrieve_(
    stockLocationId: string,
    config: FindConfig<StockLocation> = {},
    context: Context = {}
  ): Promise<StockLocation> {
    if (!isDefined(stockLocationId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"stockLocationId" must be defined`
      )
    }
    const queryOptions = ModulesSdkUtils.buildQuery<StockLocation>(
      { id: stockLocationId },
      config
    )

    const [loc] = await this.stockLocationRepository_.find(
      queryOptions,
      context
    )

    if (!loc) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `StockLocation with id ${stockLocationId} was not found`
      )
    }

    return loc
  }

  /**
   * Creates a new stock location.
   * @param data - The input data for creating a Stock Location.
   * @param context
   * @returns The created stock location.
   */

  async create(
    data: CreateStockLocationInput,
    context: Context = {}
  ): Promise<StockLocation> {
    const result = await this.create_(data, context)

    const serialized = await this.baseRepository_.serialize<StockLocation>(
      result,
      { populate: true }
    )

    return serialized
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create_(
    data: CreateStockLocationInput,
    @MedusaContext() context: Context = {}
  ): Promise<StockLocation> {
    if (isDefined(data.address) || isDefined(data.address_id)) {
      if (typeof data.address === "string" || data.address_id) {
        const addrId = (data.address ?? data.address_id) as string
        data.address_id = addrId
      } else {
        const [addressResult] =
          await this.stockLocationAddressRepository_.create(
            [data.address!],
            context
          )
        data.address_id = addressResult.id
      }
    }

    delete data.address

    const { metadata } = data
    if (metadata) {
      data.metadata = setMetadata(
        data as { metadata: Record<string, unknown> },
        metadata
      )
    }
    const [result] = await this.stockLocationRepository_.create([data], context)

    await this.eventBusService_?.emit?.(StockLocationService.Events.CREATED, {
      id: result.id,
    })

    return result
  }

  /**
   * Updates an existing stock location.
   * @param stockLocationId - The ID of the stock location to update.
   * @param updateData - The update data for the stock location.
   * @param context
   * @returns The updated stock location.
   */
  async update(
    stockLocationId: string,
    updateData: UpdateStockLocationInput,
    context: Context = {}
  ): Promise<StockLocation> {
    const updatedLocation = await this.update_(
      stockLocationId,
      updateData,
      context
    )

    const serialized = await this.baseRepository_.serialize<StockLocation>(
      updatedLocation,
      { populate: true }
    )

    return serialized
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async update_(
    stockLocationId: string,
    updateData: UpdateStockLocationInput,
    @MedusaContext() context: Context = {}
  ): Promise<StockLocation> {
    const item = await this.retrieve(stockLocationId, undefined, context)

    item.address = null

    const { address, ...data } = updateData

    if (address) {
      if (item.address_id) {
        await this.updateAddress(item.address_id, address, context)
      } else {
        const [addressResult] =
          await this.stockLocationAddressRepository_.create([address], context)
        data.address_id = addressResult.id
      }
    }

    const { metadata, ...fields } = data

    if (metadata) {
      data.metadata = setMetadata(
        data as { metadata: Record<string, unknown> | null },
        metadata
      )
    }

    const [updatedLocation] = await this.stockLocationRepository_.update(
      [{ item, update: data }],
      context
    )

    await this.eventBusService_?.emit?.(StockLocationService.Events.UPDATED, {
      id: stockLocationId,
    })

    const serialized = await this.baseRepository_.serialize<StockLocation>(
      updatedLocation,
      { populate: true }
    )

    return serialized
  }

  /**
   * Updates an address for a Stock Location.
   * @param addressId - The ID of the address to update.
   * @param address - The update data for the address.
   * @param context
   * @returns The updated stock location address.
   */
  protected async updateAddress(
    addressId: string,
    address: StockLocationAddressInput,
    context: Context = {}
  ): Promise<StockLocationAddress> {
    const updatedAddress = await this.updateAddress_(
      addressId,
      address,
      context
    )

    const serialized =
      await this.baseRepository_.serialize<StockLocationAddress>(
        updatedAddress,
        { populate: true }
      )

    return serialized
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async updateAddress_(
    addressId: string,
    address: StockLocationAddressInput,
    @MedusaContext() context: Context = {}
  ): Promise<StockLocationAddress> {
    if (!isDefined(addressId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"addressId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery<StockLocation>({
      id: addressId,
    })

    const [existingAddress] = await this.stockLocationAddressRepository_.find(
      queryOptions,
      context
    )
    if (!existingAddress) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `StockLocation address with id ${addressId} was not found`
      )
    }

    const { metadata, ...fields } = address

    let newMetadata
    if (metadata) {
      newMetadata = setMetadata(existingAddress, metadata)
    }

    if (newMetadata) {
      address.metadata = newMetadata
    }

    const [updatedAddress] = await this.stockLocationAddressRepository_.update(
      [{ item: existingAddress, update: address }],
      context
    )

    return updatedAddress
  }

  /**
   * Deletes a Stock Location.
   * @param id - The ID of the stock location to delete.
   * @param context
   * @returns An empty promise.
   */
  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    id: string,
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    await this.stockLocationRepository_.delete([id], context)

    await this.eventBusService_?.emit?.(StockLocationService.Events.DELETED, {
      id,
    })
  }
}
