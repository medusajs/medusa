import {
  CreateReservationItemInput,
  FilterableReservationItemProps,
  FindConfig,
  IEventBusService,
  SharedContext,
  UpdateReservationItemInput,
} from "@medusajs/types"
import {
  InjectEntityManager,
  MedusaContext,
  MedusaError,
  isDefined,
  promiseAll,
} from "@medusajs/utils"
import { EntityManager, FindManyOptions, In } from "typeorm"
import { InventoryLevelService } from "."
import { ReservationItem } from "../models"
import { buildQuery } from "../utils/build-query"

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
   * @param context
   * @return Array of reservation items that match the selector.
   */
  async list(
    selector: FilterableReservationItemProps = {},
    config: FindConfig<ReservationItem> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<ReservationItem[]> {
    const manager = context.transactionManager ?? this.manager_
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(selector, config) as FindManyOptions

    return await itemRepository.find(query)
  }

  /**
   * Lists reservation items that match the provided filter and returns the total count.
   * @param selector - Filters to apply to the reservation items.
   * @param config - Configuration for the query.
   * @param context
   * @return Array of reservation items that match the selector and the total count.
   */
  async listAndCount(
    selector: FilterableReservationItemProps = {},
    config: FindConfig<ReservationItem> = { relations: [], skip: 0, take: 10 },
    @MedusaContext() context: SharedContext = {}
  ): Promise<[ReservationItem[], number]> {
    const manager = context.transactionManager ?? this.manager_
    const itemRepository = manager.getRepository(ReservationItem)

    const query = buildQuery(selector, config) as FindManyOptions

    return await itemRepository.findAndCount(query)
  }

  /**
   * Retrieves a reservation item by its id.
   * @param reservationItemId - The id of the reservation item to retrieve.
   * @param config - Configuration for the query.
   * @param context
   * @return The reservation item with the provided id.
   * @throws If reservationItemId is not defined or if the reservation item was not found.
   */
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

    const manager = context.transactionManager ?? this.manager_
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
   * @param context
   * @return The created reservation item.
   */
  @InjectEntityManager()
  async create(
    data: CreateReservationItemInput[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<ReservationItem[]> {
    const manager = context.transactionManager!
    const reservationItemRepository = manager.getRepository(ReservationItem)

    const reservationItems = reservationItemRepository.create(
      data.map((tc) => ({
        inventory_item_id: tc.inventory_item_id,
        line_item_id: tc.line_item_id,
        location_id: tc.location_id,
        quantity: tc.quantity,
        metadata: tc.metadata,
        external_id: tc.external_id,
        description: tc.description,
        created_by: tc.created_by,
      }))
    )

    const [newReservationItems] = await promiseAll([
      reservationItemRepository.save(reservationItems),
      ...data.map(
        async (data) =>
          // TODO make bulk
          await this.inventoryLevelService_.adjustReservedQuantity(
            data.inventory_item_id,
            data.location_id,
            data.quantity,
            context
          )
      ),
    ])

    await this.eventBusService_?.emit?.(ReservationItemService.Events.CREATED, {
      ids: newReservationItems.map((i) => i.id),
    })

    return newReservationItems
  }

  /**
   * Update a reservation item.
   * @param reservationItemId - The reservation item's id.
   * @param data - The reservation item data to update.
   * @param context
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

    const item = await this.retrieve(reservationItemId, undefined, context)

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

    await promiseAll(ops)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.UPDATED, {
      id: mergedItem.id,
    })

    return mergedItem
  }

  /**
   * Deletes a reservation item by line item id.
   * @param lineItemId - the id of the line item to delete.
   * @param context
   */
  @InjectEntityManager()
  async deleteByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)

    const lineItemIds = Array.isArray(lineItemId) ? lineItemId : [lineItemId]

    const reservationItems = await this.list(
      { line_item_id: lineItemIds },
      undefined,
      context
    )

    const ops: Promise<unknown>[] = [
      itemRepository.softDelete({ line_item_id: In(lineItemIds) }),
    ]

    for (const reservation of reservationItems) {
      ops.push(
        this.inventoryLevelService_.adjustReservedQuantity(
          reservation.inventory_item_id,
          reservation.location_id,
          reservation.quantity * -1,
          context
        )
      )
    }

    await promiseAll(ops)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      line_item_id: lineItemId,
    })
  }

  /**
   * Deletes reservation items by location ID.
   * @param locationId - The ID of the location to delete reservations for.
   * @param context
   */
  @InjectEntityManager()
  async deleteByLocationId(
    locationId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)

    const ids = Array.isArray(locationId) ? locationId : [locationId]

    await itemRepository.softDelete({ location_id: In(ids) })

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      location_id: locationId,
    })
  }

  /**
   * Deletes a reservation item by id.
   * @param reservationItemId - the id of the reservation item to delete.
   * @param context
   */
  @InjectEntityManager()
  async delete(
    reservationItemId: string | string[],
    @MedusaContext() context: SharedContext = {}
  ): Promise<void> {
    const ids = Array.isArray(reservationItemId)
      ? reservationItemId
      : [reservationItemId]
    const manager = context.transactionManager!
    const itemRepository = manager.getRepository(ReservationItem)
    const items = await this.list({ id: ids }, undefined, context)

    const promises: Promise<unknown>[] = items.map(async (item) => {
      await this.inventoryLevelService_.adjustReservedQuantity(
        item.inventory_item_id,
        item.location_id,
        item.quantity * -1,
        context
      )
    })

    promises.push(itemRepository.softRemove(items))

    await promiseAll(promises)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      ids: reservationItemId,
    })
  }
}
