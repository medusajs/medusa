import { getConnection, EntityManager } from "typeorm"
import { isDefined, MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  buildQuery,
  FilterableStockLocationProps,
  CreateStockLocationInput,
  UpdateStockLocationInput,
  StockLocationAddressInput,
  IEventBusService,
  setMetadata,
} from "@medusajs/medusa"

import { StockLocation, StockLocationAddress } from "../models"
import { CONNECTION_NAME } from "../config"

type InjectedDependencies = {
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

  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
  }

  private getManager(): EntityManager {
    const connection = getConnection(CONNECTION_NAME)
    return connection.manager
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
    const loc = await locationRepo.findOne(query)

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
    const defaultManager = this.getManager()
    return await defaultManager.transaction(async (manager) => {
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

      await this.eventBusService_.emit(StockLocationService.Events.CREATED, {
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
    const defaultManager = this.getManager()
    return await defaultManager.transaction(async (manager) => {
      const locationRepo = manager.getRepository(StockLocation)

      const item = await this.retrieve(stockLocationId)

      const { address, metadata, ...data } = updateData

      if (address) {
        if (item.address_id) {
          await this.updateAddress(item.address_id, address, { manager })
        } else {
          const locAddressRepo = manager.getRepository(StockLocationAddress)
          const locAddress = locAddressRepo.create(address)
          const addressResult = await locAddressRepo.save(locAddress)
          data.address_id = addressResult.id
        }
      }

      if (metadata) {
        item.metadata = setMetadata(item, metadata)
      }

      const toSave = locationRepo.merge(item, data)
      await locationRepo.save(toSave)

      await this.eventBusService_.emit(StockLocationService.Events.UPDATED, {
        id: stockLocationId,
      })

      return item
    })
  }

  /**
   * Updates an address for a stock location.
   * @param {string} addressId - The ID of the address to update.
   * @param {StockLocationAddressInput} address - The update data for the address.
   * @param {Object} context - Context for the update.
   * @param {EntityManager} context.manager - The entity manager to use for the update.
   * @returns {Promise<StockLocationAddress>} - The updated stock location address.
   */

  protected async updateAddress(
    addressId: string,
    address: StockLocationAddressInput,
    context: { manager?: EntityManager } = {}
  ): Promise<StockLocationAddress> {
    const manager = context.manager || this.getManager()
    const locationAddressRepo = manager.getRepository(StockLocationAddress)

    const existingAddress = await locationAddressRepo.findOne(addressId)
    if (!existingAddress) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `StockLocation address with id ${addressId} was not found`
      )
    }

    const toSave = locationAddressRepo.merge(existingAddress, address)

    const { metadata } = address
    if (metadata) {
      toSave.metadata = setMetadata(toSave, metadata)
    }

    return await locationAddressRepo.save(toSave)
  }

  /**
   * Deletes a stock location.
   * @param {string} id - The ID of the stock location to delete.
   * @returns {Promise<void>} - An empty promise.
   */
  async delete(id: string): Promise<void> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(StockLocation)

    await locationRepo.softRemove({ id })

    await this.eventBusService_.emit(StockLocationService.Events.DELETED, {
      id,
    })
  }
}
