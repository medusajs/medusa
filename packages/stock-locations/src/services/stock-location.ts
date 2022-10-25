import { getConnection, DeepPartial, EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  buildQuery,
  FilterableStockLocationProps,
  CreateStockLocationInput,
  UpdateStockLocationInput,
  StockLocationAddressInput,
  IEventBusService,
} from "@medusajs/medusa"

import { StockLocation, StockLocationAddress } from "../models"
import { CONNECTION_NAME } from "../config"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

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

  async list(
    selector: FilterableStockLocationProps = {},
    config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 }
  ): Promise<StockLocation[]> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(StockLocation)

    const query = buildQuery(selector, config)
    return await locationRepo.find(query)
  }

  async listAndCount(
    selector: FilterableStockLocationProps = {},
    config: FindConfig<StockLocation> = { relations: [], skip: 0, take: 10 }
  ): Promise<[StockLocation[], number]> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(StockLocation)

    const query = buildQuery(selector, config)
    return await locationRepo.findAndCount(query)
  }

  async retrieve(
    itemId: string,
    config: FindConfig<StockLocation> = {}
  ): Promise<StockLocation> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(StockLocation)

    const query = buildQuery({ id: itemId }, config)
    const loc = await locationRepo.findOne(query)

    if (!loc) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `StockLocation with id ${itemId} was not found`
      )
    }

    return loc
  }

  async create(data: CreateStockLocationInput): Promise<StockLocation> {
    const defaultManager = this.getManager()
    return await defaultManager.transaction(async (manager) => {
      const locationRepo = manager.getRepository(StockLocation)

      const loc = locationRepo.create({
        name: data.name,
      })

      if (typeof data.address !== "undefined") {
        if (typeof data.address === "string") {
          loc.address_id = data.address
        } else {
          const locAddressRepo = manager.getRepository(StockLocationAddress)
          const locAddress = locAddressRepo.create(data.address)
          const addressResult = await locAddressRepo.save(locAddress)
          loc.address_id = addressResult.id
        }
      }

      const result = await locationRepo.save(loc)

      await this.eventBusService_.emit(StockLocationService.Events.CREATED, {
        id: result.id,
      })

      return result
    })
  }

  async update(
    itemId: string,
    updateData: UpdateStockLocationInput
  ): Promise<StockLocation> {
    const defaultManager = this.getManager()
    return await defaultManager.transaction(async (manager) => {
      const locationRepo = manager.getRepository(StockLocation)

      const item = await this.retrieve(itemId)

      const { address, ...data } = updateData

      let hasUpdated = false
      let shouldUpdate = Object.keys(data).some((key) => {
        return item[key] !== data[key]
      })

      if (address) {
        if (item.address_id) {
          await this.updateAddress(item.address_id, address, { manager })
          hasUpdated = true
        } else {
          const locAddressRepo = manager.getRepository(StockLocationAddress)
          const locAddress = locAddressRepo.create(address)
          const addressResult = await locAddressRepo.save(locAddress)
          data.address_id = addressResult.id
        }
        shouldUpdate = true
      }

      if (shouldUpdate) {
        const toSave = locationRepo.merge(item, data)
        await locationRepo.save(toSave)
        hasUpdated = true
      }

      if (hasUpdated) {
        await this.eventBusService_.emit(StockLocationService.Events.UPDATED, {
          id: itemId,
        })
      }

      return item
    })
  }

  protected async updateAddress(
    addressId: string,
    address: StockLocationAddressInput,
    options: { manager?: EntityManager } = {}
  ): Promise<StockLocationAddress> {
    const manager = options.manager || this.getManager()
    const locationAddressRepo = manager.getRepository(StockLocationAddress)

    const existingAddress = await locationAddressRepo.findOne(addressId)
    if (!existingAddress) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `StockLocation address with id ${addressId} was not found`
      )
    }

    const toSave = locationAddressRepo.merge(existingAddress, address)
    return await locationAddressRepo.save(toSave)
  }

  async delete(id: string): Promise<void> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(StockLocation)

    await locationRepo.softRemove({ id })

    await this.eventBusService_.emit(StockLocationService.Events.DELETED, {
      id,
    })
  }
}
