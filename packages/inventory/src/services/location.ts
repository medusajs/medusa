import { getConnection, DeepPartial, EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { FindConfig, buildQuery } from "@medusajs/medusa"

import { Location, LocationAddress } from "../models"
import { CONNECTION_NAME } from "../config"

import {
  FilterableLocationProps,
  CreateLocationInput,
  UpdateLocationInput,
  LocationAddressInput,
  IEventBusService,
} from "../types"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class LocationService {
  static Events = {
    CREATED: "inventory-level.created",
    UPDATED: "inventory-level.updated",
    DELETED: "inventory-level.deleted",
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
    selector: FilterableLocationProps = {},
    config: FindConfig<Location> = { relations: [], skip: 0, take: 10 }
  ): Promise<Location[]> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(Location)

    const query = buildQuery(selector, config)
    return await locationRepo.find(query)
  }

  async listAndCount(
    selector: FilterableLocationProps = {},
    config: FindConfig<Location> = { relations: [], skip: 0, take: 10 }
  ): Promise<[Location[], number]> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(Location)

    const query = buildQuery(selector, config)
    return await locationRepo.findAndCount(query)
  }

  async retrieve(
    itemId: string,
    config: FindConfig<Location> = {}
  ): Promise<Location> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(Location)

    const query = buildQuery({ id: itemId }, config)
    const loc = await locationRepo.findOne(query)

    if (!loc) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Location with id ${itemId} was not found`
      )
    }

    return loc.toObject()
  }

  async create(data: CreateLocationInput): Promise<Location> {
    const defaultManager = this.getManager()
    return await defaultManager.transaction(async (manager) => {
      const locationRepo = manager.getRepository(Location)

      const loc = locationRepo.create({
        name: data.name,
      })

      if (typeof data.address === "string") {
        loc.address_id = data.address
      } else {
        const locAddressRepo = manager.getRepository(LocationAddress)
        const locAddress = locAddressRepo.create(data.address)
        await locAddressRepo.save(locAddress)
        loc.address_id = locAddress.id
      }

      const result = await locationRepo.save(loc)

      await this.eventBusService_.emit(LocationService.Events.CREATED, {
        id: result.id,
      })

      return result
    })
  }

  async update(
    itemId: string,
    updateData: UpdateLocationInput
  ): Promise<Location> {
    const defaultManager = this.getManager()
    return await defaultManager.transaction(async (manager) => {
      const locationRepo = manager.getRepository(Location)

      const item = await this.retrieve(itemId)

      const { address, ...data } = updateData

      let hasUpdated = false
      const shouldUpdate = Object.keys(data).some((key) => {
        return item[key] !== data[key]
      })

      if (!shouldUpdate) {
        const toSave = locationRepo.merge(item, data)
        await locationRepo.save(toSave)
        hasUpdated = true
      }

      if (address) {
        await this.updateAddress(item.address_id, address, { manager })
        hasUpdated = true
      }

      if (hasUpdated) {
        await this.eventBusService_.emit(LocationService.Events.UPDATED, {
          id: itemId,
        })
      }

      return item
    })
  }

  protected async updateAddress(
    addressId: string,
    address: LocationAddressInput,
    options: { manager?: EntityManager } = {}
  ): Promise<LocationAddress> {
    const manager = options.manager || this.getManager()
    const locationAddressRepo = manager.getRepository(LocationAddress)

    const existingAddress = await locationAddressRepo.findOne(addressId)
    if (!existingAddress) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Location address with id ${addressId} was not found`
      )
    }

    const toSave = locationAddressRepo.merge(existingAddress, address)
    return await locationAddressRepo.save(toSave)
  }

  async delete(id: string): Promise<void> {
    const manager = this.getManager()
    const locationRepo = manager.getRepository(Location)

    await locationRepo.softRemove({ id })

    await this.eventBusService_.emit(LocationService.Events.DELETED, {
      id,
    })
  }
}
