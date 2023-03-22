import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  CreateStockLocationInput,
  FilterableStockLocationProps,
  FindConfig,
  IEventBusService,
  SharedContext,
  StockLocationAddressInput,
  UpdateStockLocationInput,
} from "@medusajs/types"
import {
  buildQuery,
  InjectEntityManager,
  isDefined,
  MedusaContext,
  MedusaError,
  setMetadata,
} from "@medusajs/utils"
import { EntityManager } from "typeorm"
import { StockLocation, StockLocationAddress } from "../models"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: IEventBusService
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

  constructor(
    { eventBusService, manager }: InjectedDependencies,
    options?: unknown,
    moduleDeclaration?: InternalModuleDeclaration
  ) {
    this.manager_ = manager
    this.eventBusService_ = eventBusService
  }

  /**
   * Lists all stock locations that match the given selector.
   * @param selector - Properties to filter by.
   * @param config - Additional configuration for the query.
   * @return A list of stock locations.
   */
  @InjectEntityManager()
  async list(
    selector: FilterableStockLocationProps = {},
    config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<StockLocation[]> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(StockLocation)

    const query = buildQuery(selector, config)
    return await locationRepo.find(query)
  }

  /**
   * Lists all stock locations that match the given selector and returns the count of matching stock locations.
   * @param selector - Properties to filter by.
   * @param config - Additional configuration for the query.
   * @return A list of stock locations and the count of matching stock locations.
   */
  @InjectEntityManager()
  async listAndCount(
    selector: FilterableStockLocationProps = {},
    config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[StockLocation[], number]> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(StockLocation)

    const query = buildQuery(selector, config)
    return await locationRepo.findAndCount(query)
  }

  /**
   * Retrieves a Stock Location by its ID.
   * @param stockLocationId - The ID of the stock location.
   * @param config - Additional configuration for the query.
   * @return The stock location.
   * @throws If the stock location ID is not definedor the stock location with the given ID was not found.
   */
  @InjectEntityManager()
  async retrieve(
    stockLocationId: string,
    config: FindConfig<StockLocation> = {},
    @MedusaContext() context: SharedContext = {}
  ): Promise<StockLocation> {
    if (!isDefined(stockLocationId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"stockLocationId" must be defined`
      )
    }

    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(StockLocation)

    const query = buildQuery({ id: stockLocationId }, config)
    const [loc] = await locationRepo.find(query)

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
   * @returns The created stock location.
   */
  @InjectEntityManager()
  async create(
    data: CreateStockLocationInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<StockLocation> {
    const manager = context.transactionManager!

    const locationRepo = manager.getRepository(StockLocation)

    const loc = locationRepo.create({
      name: data.name,
    })

    if (isDefined(data.address) || isDefined(data.address_id)) {
      if (typeof data.address === "string" || data.address_id) {
        const addrId = (data.address ?? data.address_id) as string
        loc.address_id = addrId
      } else {
        const locAddressRepo = manager.getRepository(StockLocationAddress)
        const locAddress = locAddressRepo.create(data.address!)
        const addressResult = await locAddressRepo.save(locAddress)
        loc.address_id = addressResult.id
      }
    }

    const { metadata } = data
    if (metadata) {
      loc.metadata = setMetadata(loc, metadata)
    }
    const result = await locationRepo.save(loc)

    await this.eventBusService_?.emit?.(StockLocationService.Events.CREATED, {
      id: result.id,
    })

    return result
  }

  /**
   * Updates an existing stock location.
   * @param stockLocationId - The ID of the stock location to update.
   * @param updateData - The update data for the stock location.
   * @returns The updated stock location.
   */
  @InjectEntityManager()
  async update(
    stockLocationId: string,
    updateData: UpdateStockLocationInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<StockLocation> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(StockLocation)

    const item = await this.retrieve(stockLocationId, undefined, context)

    const { address, ...data } = updateData

    if (address) {
      if (item.address_id) {
        await this.updateAddress(item.address_id, address, context)
      } else {
        const locAddressRepo = manager.getRepository(StockLocationAddress)
        const locAddress = locAddressRepo.create(address)
        const addressResult = await locAddressRepo.save(locAddress)
        data.address_id = addressResult.id
      }
    }

    const { metadata, ...fields } = data

    const toSave = locationRepo.merge(item, fields)
    if (metadata) {
      toSave.metadata = setMetadata(toSave, metadata)
    }

    await locationRepo.save(toSave)

    await this.eventBusService_?.emit?.(StockLocationService.Events.UPDATED, {
      id: stockLocationId,
    })

    return item
  }

  /**
   * Updates an address for a Stock Location.
   * @param addressId - The ID of the address to update.
   * @param address - The update data for the address.
   * @returns The updated stock location address.
   */
  @InjectEntityManager()
  protected async updateAddress(
    addressId: string,
    address: StockLocationAddressInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<StockLocationAddress> {
    if (!isDefined(addressId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"addressId" must be defined`
      )
    }

    const manager = context.transactionManager!
    const locationAddressRepo = manager.getRepository(StockLocationAddress)

    const existingAddress = await locationAddressRepo.findOne({
      where: { id: addressId },
    })
    if (!existingAddress) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `StockLocation address with id ${addressId} was not found`
      )
    }

    const { metadata, ...fields } = address

    const toSave = locationAddressRepo.merge(existingAddress, fields)
    if (metadata) {
      toSave.metadata = setMetadata(toSave, metadata)
    }

    return await locationAddressRepo.save(toSave)
  }

  /**
   * Deletes a Stock Location.
   * @param id - The ID of the stock location to delete.
   * @returns An empty promise.
   */
  @InjectEntityManager()
  async delete(
    id: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const locationRepo = manager.getRepository(StockLocation)

    await locationRepo.softRemove({ id })

    await this.eventBusService_?.emit?.(StockLocationService.Events.DELETED, {
      id,
    })
  }
}
