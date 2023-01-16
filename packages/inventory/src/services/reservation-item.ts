import { EntityManager } from "typeorm"
import { isDefined, MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  buildQuery,
  IEventBusService,
  FilterableReservationItemProps,
  CreateReservationItemInput,
  TransactionBaseService,
  UpdateReservationItemInput,
} from "@medusajs/medusa"

import { ReservationItem } from "../models"
import { CONNECTION_NAME } from "../config"
import { InventoryLevelService } from "."

type InjectedDependencies = {
  eventBusService: IEventBusService
  manager: EntityManager
  inventoryLevelService: InventoryLevelService
}

export default class ReservationItemService extends TransactionBaseService {
  static Events = {
    CREATED: "reservation-item.created",
    UPDATED: "reservation-item.updated",
    DELETED: "reservation-item.deleted",
    DELETED_BY_LINE_ITEM: "reservation-item.deleted-by-line-item",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly eventBusService_: IEventBusService
  protected readonly inventoryLevelService_: InventoryLevelService

  constructor({
    eventBusService,
    manager,
    inventoryLevelService,
  }: InjectedDependencies) {
    super(arguments[0])

    this.manager_ = manager
    this.eventBusService_ = eventBusService
    this.inventoryLevelService_ = inventoryLevelService
  }

  private getManager(): EntityManager {
    return this.transactionManager_ ?? this.manager_
  }

  /**
   * Lists reservation items that match the provided filter.
   * @param selector - Filters to apply to the reservation items.
   * @param config - Configuration for the query.
   * @return Array of reservation items that match the selector.
   */
  async list(
    selector: FilterableReservationItemProps = {},
    config: FindConfig<ReservationItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<ReservationItem[]> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(selector, config)
    return await itemRepository.find(query)
  }

  /**
   * Lists reservation items that match the provided filter and returns the total count.
   * @param selector - Filters to apply to the reservation items.
   * @param config - Configuration for the query.
   * @return Array of reservation items that match the selector and the total count.
   */
  async listAndCount(
    selector: FilterableReservationItemProps = {},
    config: FindConfig<ReservationItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<[ReservationItem[], number]> {
    const manager = this.getManager()
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(selector, config)
    return await itemRepository.findAndCount(query)
  }

  /**
   * Retrieves a reservation item by its id.
   * @param reservationItemId - The id of the reservation item to retrieve.
   * @param config - Configuration for the query.
   * @return The reservation item with the provided id.
   * @throws If reservationItemId is not defined or if the reservation item was not found.
   */
  async retrieve(
    reservationItemId: string,
    config: FindConfig<ReservationItem> = {}
  ): Promise<ReservationItem> {
    if (!isDefined(reservationItemId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"reservationItemId" must be defined`
      )
    }

    const manager = this.getManager()
    const reservationItemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery({ id: reservationItemId }, config)
    const [reservationItem] = await reservationItemRepository.find(query)

    if (!reservationItem) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `ReservationItem with id ${reservationItemId} was not found`
      )
    }

    return reservationItem
  }

  /**
   * Create a new reservation item.
   * @param data - The reservation item data.
   * @return The created reservation item.
   */
  async create(data: CreateReservationItemInput): Promise<ReservationItem> {
    return await this.atomicPhase_(async (manager) => {
      const itemRepository = manager.getRepository(ReservationItem)

      const inventoryItem = itemRepository.create({
        inventory_item_id: data.inventory_item_id,
        line_item_id: data.line_item_id,
        location_id: data.location_id,
        quantity: data.quantity,
        metadata: data.metadata,
      })

      const [newInventoryItem] = await Promise.all([
        itemRepository.save(inventoryItem),
        this.inventoryLevelService_
          .withTransaction(manager)
          .adjustReservedQuantity(
            data.inventory_item_id,
            data.location_id,
            data.quantity
          ),
      ])

      await this.eventBusService_
        .withTransaction(manager)
        .emit(ReservationItemService.Events.CREATED, {
          id: newInventoryItem.id,
        })

      return newInventoryItem
    })
  }

  /**
   * Update a reservation item.
   * @param reservationItemId - The reservation item's id.
   * @param data - The reservation item data to update.
   * @return The updated reservation item.
   */
  async update(
    reservationItemId: string,
    data: UpdateReservationItemInput
  ): Promise<ReservationItem> {
    return await this.atomicPhase_(async (manager) => {
      const itemRepository = manager.getRepository(ReservationItem)

      const item = await this.retrieve(reservationItemId)

      const shouldUpdateQuantity =
        isDefined(data.quantity) && data.quantity !== item.quantity

      const ops: Promise<unknown>[] = []
      if (shouldUpdateQuantity) {
        const quantityDiff = data.quantity! - item.quantity
        ops.push(
          this.inventoryLevelService_
            .withTransaction(manager)
            .adjustReservedQuantity(
              item.inventory_item_id,
              item.location_id,
              quantityDiff
            )
        )
      }

      const mergedItem = itemRepository.merge(item, data)

      ops.push(itemRepository.save(item))

      await Promise.all(ops)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(ReservationItemService.Events.UPDATED, {
          id: mergedItem.id,
        })

      return mergedItem
    })
  }

  /**
   * Deletes a reservation item by line item id.
   * @param lineItemId - the id of the line item to delete.
   */
  async deleteByLineItem(lineItemId: string): Promise<void> {
    await this.atomicPhase_(async (manager) => {
      const itemRepository = manager.getRepository(ReservationItem)

      const items = await this.list({ line_item_id: lineItemId })

      const ops: Promise<unknown>[] = []
      for (const item of items) {
        ops.push(itemRepository.softRemove({ line_item_id: lineItemId }))
        ops.push(
          this.inventoryLevelService_
            .withTransaction(manager)
            .adjustReservedQuantity(
              item.inventory_item_id,
              item.location_id,
              item.quantity * -1
            )
        )
      }
      await Promise.all(ops)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(ReservationItemService.Events.DELETED_BY_LINE_ITEM, {
          line_item_id: lineItemId,
        })
    })
  }

  /**
   * Deletes a reservation item by id.
   * @param reservationItemId - the id of the reservation item to delete.
   */
  async delete(reservationItemId: string): Promise<void> {
    await this.atomicPhase_(async (manager) => {
      const itemRepository = manager.getRepository(ReservationItem)
      const item = await this.retrieve(reservationItemId)

      await Promise.all([
        itemRepository.softRemove({ id: reservationItemId }),
        this.inventoryLevelService_
          .withTransaction(manager)
          .adjustReservedQuantity(
            item.inventory_item_id,
            item.location_id,
            item.quantity * -1
          ),
      ])
    })

    await this.eventBusService_.emit(ReservationItemService.Events.DELETED, {
      id: reservationItemId,
    })
  }
}
