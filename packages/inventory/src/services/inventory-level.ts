import { getConnection, DeepPartial, EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  buildQuery,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
  IEventBusService,
} from "@medusajs/medusa"

import { InventoryLevel } from "../models"
import { CONNECTION_NAME } from "../config"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class InventoryLevelService {
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
    selector: FilterableInventoryLevelProps = {},
    config: FindConfig<InventoryLevel> = { relations: [], skip: 0, take: 10 }
  ): Promise<InventoryLevel[]> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(selector, config)
    return await levelRepository.find(query)
  }

  async listAndCount(
    selector: FilterableInventoryLevelProps = {},
    config: FindConfig<InventoryLevel> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryLevel[], number]> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery(selector, config)
    return await levelRepository.findAndCount(query)
  }

  async retrieve(
    levelId: string,
    config: FindConfig<InventoryLevel> = {}
  ): Promise<InventoryLevel> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const query = buildQuery({ id: levelId }, config)
    const inventoryLevel = await levelRepository.findOne(query)

    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `InventoryLevel with id ${levelId} was not found`
      )
    }

    return inventoryLevel
  }

  async create(data: CreateInventoryLevelInput): Promise<InventoryLevel> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const inventoryLevel = levelRepository.create({
      location_id: data.location_id,
      item_id: data.item_id,
      stocked_quantity: data.stocked_quantity,
      incoming_quantity: data.incoming_quantity ?? 0,
    })

    const result = await levelRepository.save(inventoryLevel)

    await this.eventBusService_.emit(InventoryLevelService.Events.CREATED, {
      id: result.id,
    })

    return result
  }

  async update(
    itemId: string,
    data: Omit<
      DeepPartial<InventoryLevel>,
      "id" | "created_at" | "metadata" | "deleted_at"
    >
  ): Promise<InventoryLevel> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const item = await this.retrieve(itemId)

    const shouldUpdate = Object.keys(data).some((key) => {
      return item[key] !== data[key]
    })

    if (shouldUpdate) {
      levelRepository.merge(item, data)
      await levelRepository.save(item)

      await this.eventBusService_.emit(InventoryLevelService.Events.UPDATED, {
        id: item.id,
      })
    }

    return item
  }

  async delete(id: string): Promise<void> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    await levelRepository.softRemove({ id })

    await this.eventBusService_.emit(InventoryLevelService.Events.DELETED, {
      id,
    })
  }

  async getStockedQuantity(
    itemId: string,
    locationIds: string[]
  ): Promise<number> {
    const manager = this.getManager()
    const levelRepository = manager.getRepository(InventoryLevel)

    const result = await levelRepository
      .createQueryBuilder()
      .select("SUM(stocked_quantity)", "quantity")
      .where("item_id = :itemId", { itemId })
      .andWhere("location_id IN (:...locationIds)", { locationIds })
      .getRawOne()

    return result.quantity
  }
}
