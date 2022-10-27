import { ILike, In, getConnection, DeepPartial, EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  buildQuery,
  IEventBusService,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
} from "@medusajs/medusa"

import { InventoryItem } from "../models"
import { CONNECTION_NAME } from "../config"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class InventoryItemService {
  static Events = {
    CREATED: "inventory-item.created",
    UPDATED: "inventory-item.updated",
    DELETED: "inventory-item.deleted",
  }

  protected readonly eventBusService_: IEventBusService

  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
  }

  private getManager(): EntityManager {
    const connection = getConnection(CONNECTION_NAME)
    return connection.manager
  }

  async list(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<InventoryItem[]> {
    const queryBuilder = this.getListQuery(selector, config)
    return await queryBuilder.getMany()
  }

  private getListQuery(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ) {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)
    const query = buildQuery(selector, config)

    const queryBuilder = itemRepository.createQueryBuilder("item")

    if (query.where.q) {
      query.where.sku = ILike(`%${query.where.q as string}%`)

      delete query.where.q
    }

    if ("location_id" in query.where) {
      const locationIds = Array.isArray(selector.location_id)
        ? selector.location_id
        : [selector.location_id]

      queryBuilder.innerJoin(
        "inventory_level",
        "level",
        "level.item_id = item.id AND level.location_id IN (:...locationIds)",
        { locationIds }
      )

      delete query.where.location_id
    }

    if (query.take) {
      queryBuilder.take(query.take)
    }

    if (query.skip) {
      queryBuilder.skip(query.skip)
    }

    if (query.where) {
      queryBuilder.where(query.where)
    }

    if (query.select) {
      queryBuilder.select(query.select.map((s) => "item." + s))
    }

    if (query.order) {
      const toSelect: string[] = []
      const parsed = Object.entries(query.order).reduce((acc, [k, v]) => {
        const key = `item.${k}`
        toSelect.push(key)
        acc[key] = v
        return acc
      }, {})
      queryBuilder.addSelect(toSelect)
      queryBuilder.orderBy(parsed)
    }

    return queryBuilder
  }

  async listAndCount(
    selector: FilterableInventoryItemProps = {},
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryItem[], number]> {
    const queryBuilder = this.getListQuery(selector, config)
    return await queryBuilder.getManyAndCount()
  }

  async retrieve(
    itemId: string,
    config: FindConfig<InventoryItem> = {}
  ): Promise<InventoryItem> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)

    const query = buildQuery({ id: itemId }, config)
    const inventoryItem = await itemRepository.findOne(query)

    if (!inventoryItem) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `InventoryItem with id ${itemId} was not found`
      )
    }

    return inventoryItem
  }

  async create(data: CreateInventoryItemInput): Promise<InventoryItem> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)

    const inventoryItem = itemRepository.create({
      sku: data.sku,
      origin_country: data.origin_country,
      metadata: data.metadata,
      hs_code: data.hs_code,
      mid_code: data.mid_code,
      material: data.material,
      weight: data.weight,
      length: data.length,
      height: data.height,
      width: data.width,
      requires_shipping: data.requires_shipping || false,
    })

    const result = await itemRepository.save(inventoryItem)

    await this.eventBusService_.emit(InventoryItemService.Events.CREATED, {
      id: result.id,
    })

    return result
  }

  async update(
    itemId: string,
    data: Omit<
      DeepPartial<InventoryItem>,
      "id" | "created_at" | "metadata" | "deleted_at"
    >
  ): Promise<InventoryItem> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)

    const item = await this.retrieve(itemId)

    const shouldUpdate = Object.keys(data).some((key) => {
      return item[key] !== data[key]
    })

    if (shouldUpdate) {
      itemRepository.merge(item, data)
      await itemRepository.save(item)

      await this.eventBusService_.emit(InventoryItemService.Events.UPDATED, {
        id: item.id,
      })
    }

    return item
  }

  async delete(id: string): Promise<void> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(InventoryItem)

    await itemRepository.softRemove({ id })

    await this.eventBusService_.emit(InventoryItemService.Events.DELETED, {
      id,
    })
  }
}
