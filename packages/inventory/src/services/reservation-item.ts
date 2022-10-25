import { getConnection, DeepPartial, EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  buildQuery,
  IEventBusService,
  FilterableReservationItemProps,
  CreateReservationItemInput,
} from "@medusajs/medusa"

import { ReservationItem } from "../models"
import { CONNECTION_NAME } from "../config"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class ReservationItemService {
  static Events = {
    CREATED: "reservation-item.created",
    UPDATED: "reservation-item.updated",
    DELETED: "reservation-item.deleted",
    DELETED_BY_LINE_ITEM: "reservation-item.deleted-by-line-item",
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
    selector: FilterableReservationItemProps = {},
    config: FindConfig<ReservationItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<ReservationItem[]> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(selector, config)
    return await itemRepository.find(query)
  }

  async listAndCount(
    selector: FilterableReservationItemProps = {},
    config: FindConfig<ReservationItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<[ReservationItem[], number]> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(selector, config)
    return await itemRepository.findAndCount(query)
  }

  async retrieve(
    itemId: string,
    config: FindConfig<ReservationItem> = {}
  ): Promise<ReservationItem> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery({ id: itemId }, config)
    const inventoryItem = await itemRepository.findOne(query)

    if (!inventoryItem) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `ReservationItem with id ${itemId} was not found`
      )
    }

    return inventoryItem
  }

  async create(data: CreateReservationItemInput): Promise<ReservationItem> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    const inventoryItem = itemRepository.create({
      item_id: data.item_id,
      location_id: data.location_id,
      quantity: data.quantity,
      metadata: data.metadata,
    })

    const result = await itemRepository.save(inventoryItem)

    await this.eventBusService_.emit(ReservationItemService.Events.CREATED, {
      id: result.id,
    })

    return result
  }

  async update(
    itemId: string,
    data: Omit<
      DeepPartial<ReservationItem>,
      "id" | "created_at" | "metadata" | "deleted_at"
    >
  ): Promise<ReservationItem> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    const item = await this.retrieve(itemId)

    const shouldUpdate = Object.keys(data).some((key) => {
      return item[key] !== data[key]
    })

    if (shouldUpdate) {
      itemRepository.merge(item, data)
      await itemRepository.save(item)

      await this.eventBusService_.emit(ReservationItemService.Events.UPDATED, {
        id: item.id,
      })
    }

    return item
  }

  async deleteByLineItem(lineItemId: string): Promise<void> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    await itemRepository.softRemove({ line_item_id: lineItemId })

    await this.eventBusService_.emit(
      ReservationItemService.Events.DELETED_BY_LINE_ITEM,
      {
        line_item_id: lineItemId,
      }
    )
  }

  async delete(id: string): Promise<void> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    await itemRepository.softRemove({ id })

    await this.eventBusService_.emit(ReservationItemService.Events.DELETED, {
      id,
    })
  }

  async getReservedQuantity(
    itemId: string,
    locationIds: string[]
  ): Promise<number> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    const result = await itemRepository
      .createQueryBuilder()
      .select("SUM(quantity)", "quantity")
      .where("item_id = :itemId", { itemId })
      .andWhere("location_id IN (:...locationIds)", { locationIds })
      .getRawOne()

    return result.quantity
  }
}
