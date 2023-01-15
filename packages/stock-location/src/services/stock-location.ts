import {
  buildQuery,
  ConfigurableModuleDeclaration,
  CreateStockLocationInput,
  FilterableStockLocationProps,
  FindConfig,
  IEventBusService,
  MODULE_RESOURCE_TYPE,
  setMetadata,
  StockLocationAddressInput,
  TransactionBaseService,
  UpdateStockLocationInput,
} from "@medusajs/medusa"
import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"

import { StockLocation, StockLocationAddress } from "../models"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: IEventBusService
}

/**
 * Service for managing stock locations.
 */

export default class StockLocationService extends TransactionBaseService {
  static Events = {
    CREATED: "stock-location.created",
    UPDATED: "stock-location.updated",
    DELETED: "stock-location.deleted",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly eventBusService_: IEventBusService

  constructor(
    { eventBusService, manager }: InjectedDependencies,
    options?: unknown,
    moduleDeclaration?: ConfigurableModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    if (moduleDeclaration?.resources !== MODULE_RESOURCE_TYPE.SHARED) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "At the moment this module can only be used with shared resources"
      )
    }

    this.eventBusService_ = eventBusService
    this.manager_ = manager
  }

  private getManager(): EntityManager {
    return this.transactionManager_ ?? this.manager_
  }

  /**
   * Lists all stock locations that match the given selector.
   * @param {FilterableStockLocationProps} [selector={}] - Properties to filter by.
   * @param {FindConfig} [config={ relations: [], skip: 0, take: 10 }] - Additional configuration for the query.
   * @return {Promise<StockLocation[]>} A list of stock locations.
   */
  async list(
    selector: FilterableStockLocationProps = {},
    config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 }
  ): Promise<StockLocation[]> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(StockLocation)

    const query = buildQuery(selector, config)
    return await locationRepo.find(query)
  }

  /**
   * Lists all stock locations that match the given selector and returns the count of matching stock locations.
   * @param {FilterableStockLocationProps} [selector={}] - Properties to filter by.
   * @param {FindConfig} [config={ relations: [], skip: 0, take: 10 }] - Additional configuration for the query.
   * @return {Promise<[StockLocation[], number]>} A list of stock locations and the count of matching stock locations.
   */
  async listAndCount(
    selector: FilterableStockLocationProps = {},
    config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 }
  ): Promise<[StockLocation[], number]> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(StockLocation)

    const query = buildQuery(selector, config)
    return await locationRepo.findAndCount(query)
  }

  /**
   * Retrieves a stock location by its ID.
   * @param {string} stockLocationId - The ID of the stock location.
   * @param {FindConfig} [config={}] - Additional configuration for the query.
   * @return {Promise<StockLocation>} The stock location.
   * @throws {MedusaError} If the stock location ID is not defined.
   * @throws {MedusaError} If the stock location with the given ID was not found.
   */
  async retrieve(
    stockLocationId: string,
    config: FindConfig<StockLocation> = {}
  ): Promise<StockLocation> {
    if (!isDefined(stockLocationId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"stockLocationId" must be defined`
      )
    }

    const manager = this.getManager()
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
   * @param {CreateStockLocationInput} data - The input data for creating a stock location.
   * @returns {Promise<StockLocation>} - The created stock location.
   */
  async create(data: CreateStockLocationInput): Promise<StockLocation> {
    return await this.atomicPhase_(async (manager) => {
      const locationRepo = manager.getRepository(StockLocation)

      const loc = locationRepo.create({
        name: data.name,
      })

      if (isDefined(data.address) || isDefined(data.address_id)) {
        if (typeof data.address === "string" || data.address_id) {
          const addrId = (data.address ?? data.address_id) as string
          const address = await this.retrieve(addrId, {
            select: ["id"],
          })
          loc.address_id = address.id
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

      await this.eventBusService_
        .withTransaction(manager)
        .emit(StockLocationService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Updates an existing stock location.
   * @param {string} stockLocationId - The ID of the stock location to update.
   * @param {UpdateStockLocationInput} updateData - The update data for the stock location.
   * @returns {Promise<StockLocation>} - The updated stock location.
   */

  async update(
    stockLocationId: string,
    updateData: UpdateStockLocationInput
  ): Promise<StockLocation> {
    return await this.atomicPhase_(async (manager) => {
      const locationRepo = manager.getRepository(StockLocation)

      const item = await this.retrieve(stockLocationId)

      const { address, ...data } = updateData

      if (address) {
        if (item.address_id) {
          await this.updateAddress(item.address_id, address)
        } else {
          const locAddressRepo = manager.getRepository(StockLocationAddress)
          const locAddress = locAddressRepo.create(address)
          const addressResult = await locAddressRepo.save(locAddress)
          data.address_id = addressResult.id
        }
      }

      const { metadata, ...fields } = updateData

      const toSave = locationRepo.merge(item, fields)
      if (metadata) {
        toSave.metadata = setMetadata(toSave, metadata)
      }

      await locationRepo.save(toSave)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(StockLocationService.Events.UPDATED, {
          id: stockLocationId,
        })

      return item
    })
  }

  /**
   * Updates an address for a stock location.
   * @param {string} addressId - The ID of the address to update.
   * @param {StockLocationAddressInput} address - The update data for the address.
   * @returns {Promise<StockLocationAddress>} - The updated stock location address.
   */

  protected async updateAddress(
    addressId: string,
    address: StockLocationAddressInput
  ): Promise<StockLocationAddress> {
    if (!isDefined(addressId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"addressId" must be defined`
      )
    }

    return await this.atomicPhase_(async (manager) => {
      const locationAddressRepo = manager.getRepository(StockLocationAddress)

      const existingAddress = await locationAddressRepo.findOne({
        id: addressId,
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
    })
  }

  /**
   * Deletes a stock location.
   * @param {string} id - The ID of the stock location to delete.
   * @returns {Promise<void>} - An empty promise.
   */
  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const locationRepo = manager.getRepository(StockLocation)

      await locationRepo.softRemove({ id })

      await this.eventBusService_
        .withTransaction(manager)
        .emit(StockLocationService.Events.DELETED, {
          id,
        })
    })
  }
}
