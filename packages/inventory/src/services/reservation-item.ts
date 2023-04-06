import {
  CreateReservationItemInput,
  FilterableReservationItemProps,
  FindConfig,
  IEventBusService,
  SharedContext,
  UpdateReservationItemInput,
} from "@medusajs/types"
import {
  buildQuery,
  InjectEntityManager,
  isDefined,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"
import { EntityManager, FindManyOptions } from "typeorm"
import { InventoryLevelService } from "."
import { ReservationItem } from "../models"

type InjectedDependencies = {
  eventBusService: IEventBusService
  manager: EntityManager
  inventoryLevelService: InventoryLevelService
}

export default class ReservationItemService {
  static Events = {
    CREATED: "reservation-item.created",
    UPDATED: "reservation-item.updated",
    DELETED: "reservation-item.deleted",
  }

  protected readonly manager_: EntityManager
  protected readonly eventBusService_: IEventBusService | undefined
  protected readonly inventoryLevelService_: InventoryLevelService

  constructor({
    eventBusService,
    inventoryLevelService,
    manager,
  }: InjectedDependencies) {
    this.manager_ = manager
    this.eventBusService_ = eventBusService
    this.inventoryLevelService_ = inventoryLevelService
  }

  /**
   * Lists reservation items that match the provided filter.
   * @param selector - Filters to apply to the reservation items.
   * @param config - Configuration for the query.
   * @return Array of reservation items that match the selector.
   */
  @InjectEntityManager()
  async list(
    selector: FilterableReservationItemProps = {},
    config: FindConfig<ReservationItem> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<ReservationItem[]> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(selector, config) as FindManyOptions
    return await itemRepository.find(query)
  }

  /**
   * Lists reservation items that match the provided filter and returns the total count.
   * @param selector - Filters to apply to the reservation items.
   * @param config - Configuration for the query.
   * @return Array of reservation items that match the selector and the total count.
   */
  @InjectEntityManager()
  async listAndCount(
    selector: FilterableReservationItemProps = {},
    config: FindConfig<ReservationItem> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[ReservationItem[], number]> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(selector, config) as FindManyOptions
    return await itemRepository.findAndCount(query)
  }

  /**
   * Retrieves a reservation item by its id.
   * @param reservationItemId - The id of the reservation item to retrieve.
   * @param config - Configuration for the query.
   * @return The reservation item with the provided id.
   * @throws If reservationItemId is not defined or if the reservation item was not found.
   */
  @InjectEntityManager()
  async retrieve(
    reservationItemId: string,
    config: FindConfig<ReservationItem> = {},
    @MedusaContext() context: SharedContext = {}
  ): Promise<ReservationItem> {
    if (!isDefined(reservationItemId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"reservationItemId" must be defined`
      )
    }

    const manager = context.transactionManager!
    const reservationItemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(
      { id: reservationItemId },
      config
    ) as FindManyOptions
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
  @InjectEntityManager()
  async create(
    data: CreateReservationItemInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<ReservationItem> {
    const manager = context.transactionManager!
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
      this.inventoryLevelService_.adjustReservedQuantity(
        data.inventory_item_id,
        data.location_id,
        data.quantity,
        context
      ),
    ])

    await this.eventBusService_?.emit?.(ReservationItemService.Events.CREATED, {
      id: newInventoryItem.id,
    })

    return newInventoryItem
  }

  /**
   * Update a reservation item.
   * @param reservationItemId - The reservation item's id.
   * @param data - The reservation item data to update.
   * @return The updated reservation item.
   */
  @InjectEntityManager()
  async update(
    reservationItemId: string,
    data: UpdateReservationItemInput,
    @MedusaContext() context: SharedContext = {}
  ): Promise<ReservationItem> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)

    const item = await this.retrieve(reservationItemId)

    const shouldUpdateQuantity =
      isDefined(data.quantity) && data.quantity !== item.quantity

    const shouldUpdateLocation =
      isDefined(data.location_id) && data.location_id !== item.location_id

    const ops: Promise<unknown>[] = []

    if (shouldUpdateLocation) {
      ops.push(
        this.inventoryLevelService_.adjustReservedQuantity(
          item.inventory_item_id,
          item.location_id,
          item.quantity * -1,
          context
        ),
        this.inventoryLevelService_.adjustReservedQuantity(
          item.inventory_item_id,
          data.location_id!,
          data.quantity || item.quantity!,
          context
        )
      )
    } else if (shouldUpdateQuantity) {
      const quantityDiff = data.quantity! - item.quantity
      ops.push(
        this.inventoryLevelService_.adjustReservedQuantity(
          item.inventory_item_id,
          item.location_id,
          quantityDiff,
          context
        )
      )
    }

    const mergedItem = itemRepository.merge(item, data)

    ops.push(itemRepository.save(item))

    await Promise.all(ops)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.UPDATED, {
      id: mergedItem.id,
    })

    return mergedItem
  }

  /**
   * Deletes a reservation item by line item id.
   * @param lineItemId - the id of the line item to delete.
   */
  @InjectEntityManager()
  async deleteByLineItem(
    lineItemId: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)

    const items = await this.list(
      { line_item_id: lineItemId },
      undefined,
      context
    )

    const ops: Promise<unknown>[] = [
      itemRepository.softDelete({ line_item_id: lineItemId })
    ]
    for (const item of items) {
      ops.push(
        this.inventoryLevelService_.adjustReservedQuantity(
          item.inventory_item_id,
          item.location_id,
          item.quantity * -1,
          context
        )
      )
    }
    await Promise.all(ops)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      line_item_id: lineItemId,
    })
  }

  /**
   * Deletes reservation items by location ID.
   * @param locationId - The ID of the location to delete reservations for.
   */
  @InjectEntityManager()
  async deleteByLocationId(
    locationId: string,
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)

    await itemRepository
      .createQueryBuilder("reservation_item")
      .softDelete()
      .where("location_id = :locationId", { locationId })
      .andWhere("deleted_at IS NULL")
      .execute()

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      location_id: locationId,
    })
  }

  /**
   * Deletes a reservation item by id.
   * @param reservationItemId - the id of the reservation item to delete.
   */
  async delete(
    reservationItemId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const ids = Array.isArray(reservationItemId)
      ? reservationItemId
      : [reservationItemId]
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)
    const items = await this.list({ id: ids })

    const promises: Promise<unknown>[] = items.map(async (item) => {
      this.inventoryLevelService_.adjustReservedQuantity(
        item.inventory_item_id,
        item.location_id,
        item.quantity * -1,
        context
      )
    })

    promises.push(itemRepository.softRemove(items))

    await Promise.all(promises)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      id: reservationItemId,
    })
  }
}
