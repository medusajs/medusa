import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  CreateStockLocationInput,
  FilterableStockLocationProps,
  FindConfig,
  IEventBusService,
  MODULE_RESOURCE_TYPE,
  ModuleJoinerConfig,
  SharedContext,
  StockLocationAddressInput,
  UpdateStockLocationInput,
} from "@medusajs/types"
import {
  InjectEntityManager,
  isDefined,
  MedusaContext,
  MedusaError,
  setMetadata,
} from "@medusajs/utils"
import { EntityManager, FindOptionsWhere, ILike } from "typeorm"
import { joinerConfig } from "../joiner-config"
import { StockLocation, StockLocationAddress } from "../models"
import { buildQuery } from "../utils/build-query"

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
    protected readonly moduleDeclaration?: InternalModuleDeclaration
  ) {
    this.manager_ = manager
    this.eventBusService_ = eventBusService
  }

  __joinerConfig(): ModuleJoinerConfig {
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
    @MedusaContext() context: SharedContext = {}
  ): Promise<StockLocation[]> {
    const [locations] = await this.listAndCount(selector, config, context)
    return locations
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
    @MedusaContext() context: SharedContext = {}
  ): Promise<[StockLocation[], number]> {
    const manager = context.transactionManager ?? this.manager_
    const locationRepo = manager.getRepository(StockLocation)
    let q
    if (selector.q) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      const where = query.where as FindOptionsWhere<StockLocation>

      delete where.name

      query.where = [
        {
          ...where,
          name: ILike(`%${q}%`),
        },
      ]
    }

    return await locationRepo.findAndCount(query)
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
    @MedusaContext() context: SharedContext = {}
  ): Promise<StockLocation> {
    if (!isDefined(stockLocationId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"stockLocationId" must be defined`
      )
    }

    const manager = context.transactionManager ?? this.manager_
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
   * @param context
   * @returns The created stock location.
   */
  @InjectEntityManager(
    (target) =>
      target.moduleDeclaration?.resources === MODULE_RESOURCE_TYPE.ISOLATED
  )
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
   * @param context
   * @returns The updated stock location.
   */
  @InjectEntityManager(
    (target) =>
      target.moduleDeclaration?.resources === MODULE_RESOURCE_TYPE.ISOLATED
  )
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
   * @param context
   * @returns The updated stock location address.
   */
  @InjectEntityManager(
    (target) =>
      target.moduleDeclaration?.resources === MODULE_RESOURCE_TYPE.ISOLATED
  )
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
   * @param context
   * @returns An empty promise.
   */
  @InjectEntityManager(
    (target) =>
      target.moduleDeclaration?.resources === MODULE_RESOURCE_TYPE.ISOLATED
  )
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
