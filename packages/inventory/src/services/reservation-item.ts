import {
  Context,
  CreateReservationItemInput,
  FilterableReservationItemProps,
  FindConfig,
  IEventBusService,
  SharedContext,
  UpdateReservationItemInput,
} from "@medusajs/types"
import {
  InjectEntityManager,
  InjectTransactionManager,
  isDefined,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { InventoryLevelService } from "."
import { ReservationItem } from "../models"
import { buildQuery } from "../utils/build-query"
import { ReservationItemRepository } from "../repositories"
import { doNotForceTransaction } from "../utils"

type InjectedDependencies = {
  eventBusService: IEventBusService
  inventoryLevelService: InventoryLevelService
  reservationItemRepository: ReservationItemRepository
}

export default class ReservationItemService {
  static Events = {
    CREATED: "reservation-item.created",
    UPDATED: "reservation-item.updated",
    DELETED: "reservation-item.deleted",
  }

  protected readonly eventBusService_: IEventBusService | undefined
  protected readonly inventoryLevelService_: InventoryLevelService
  protected readonly reservationItemRepository_: ReservationItemRepository

  constructor({
    eventBusService,
    inventoryLevelService,
    reservationItemRepository,
  }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
    this.inventoryLevelService_ = inventoryLevelService
    this.reservationItemRepository_ = reservationItemRepository
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
    context: Context = {}
  ): Promise<ReservationItem[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ReservationItem>(
      selector,
      config
    )

    return await this.reservationItemRepository_.find(queryOptions, context)
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
    context: Context = {}
  ): Promise<[ReservationItem[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ReservationItem>(
      selector,
      config
    )

    return await this.reservationItemRepository_.findAndCount(
      queryOptions,
      context
    )
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
    context: Context = {}
  ): Promise<ReservationItem> {
    if (!isDefined(reservationItemId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"reservationItemId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery<ReservationItem>(
      {
        id: reservationItemId,
      },
      config
    )

    const [reservationItem] = await this.reservationItemRepository_.find(
      queryOptions,
      context
    )

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
  @InjectTransactionManager(doNotForceTransaction, "reservationItemRepository_")
  async create(
    data: CreateReservationItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<ReservationItem[]> {
    const newReservationItems = await this.reservationItemRepository_.create(
      data,
      {
        transactionManager: context.transactionManager,
      }
    )

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
  @InjectTransactionManager(doNotForceTransaction, "reservationItemRepository_")
  async update(
    reservationItemId: string,
    data: UpdateReservationItemInput,
    @MedusaContext() context: Context = {}
  ): Promise<ReservationItem> {
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

    ops.push(
      this.reservationItemRepository_.update([{ item, update: data }], context)
    )

    const [, , reservationItems] = await Promise.all(ops)

    const [updatedItem] = reservationItems as ReservationItem[]

    await this.eventBusService_?.emit?.(ReservationItemService.Events.UPDATED, {
      id: updatedItem.id,
    })

    return updatedItem
  }

  /**
   * Deletes a reservation item by line item id.
   * @param lineItemId - the id of the line item to delete.
   * @param context
   */
  @InjectTransactionManager(doNotForceTransaction, "reservationItemRepository_")
  async deleteByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const lineItemIds = Array.isArray(lineItemId) ? lineItemId : [lineItemId]

    const reservationItems = await this.list(
      { line_item_id: lineItemIds },
      undefined,
      context
    )

    const ops: Promise<unknown>[] = [
      this.reservationItemRepository_.delete(reservationItems.map((i) => i.id)),
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

    await Promise.all(ops)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      line_item_id: lineItemId,
    })
  }

  /**
   * Deletes reservation items by location ID.
   * @param locationId - The ID of the location to delete reservations for.
   * @param context
   */
  @InjectTransactionManager(doNotForceTransaction, "reservationItemRepository_")
  async deleteByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const ids = Array.isArray(locationId) ? locationId : [locationId]

    const reservationItems = await this.list(
      { location_id: ids },
      undefined,
      context
    )
    const ops: Promise<unknown>[] = [
      this.reservationItemRepository_.delete(reservationItems.map((i) => i.id)),
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

    await Promise.all(ops)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      location_id: locationId,
    })
  }

  /**
   * Deletes a reservation item by id.
   * @param reservationItemId - the id of the reservation item to delete.
   * @param context
   */
  @InjectTransactionManager(doNotForceTransaction, "reservationItemRepository_")
  async delete(
    reservationItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const ids = Array.isArray(reservationItemId)
      ? reservationItemId
      : [reservationItemId]

    const reservationItems = await this.list({ id: ids }, undefined, context)

    const ops: Promise<unknown>[] = [
      this.reservationItemRepository_.delete(reservationItems.map((i) => i.id)),
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

    await Promise.all(ops)

    await this.eventBusService_?.emit?.(ReservationItemService.Events.DELETED, {
      ids: reservationItemId,
    })
  }
}
