import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  Context,
  DAL,
  IInventoryServiceNext,
  InventoryNext,
  InventoryTypes,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ReservationItemDTO,
} from "@medusajs/types"
import {
  CommonEvents,
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  InventoryEvents,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  isDefined,
  isString,
  partitionArray,
  promiseAll,
} from "@medusajs/utils"
import { InventoryItem, InventoryLevel, ReservationItem } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import InventoryLevelService from "./inventory-level"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  inventoryItemService: ModulesSdkTypes.InternalModuleService<any>
  inventoryLevelService: InventoryLevelService<any>
  reservationItemService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [InventoryItem, InventoryLevel, ReservationItem]

export default class InventoryModuleService<
    TInventoryItem extends InventoryItem = InventoryItem,
    TInventoryLevel extends InventoryLevel = InventoryLevel,
    TReservationItem extends ReservationItem = ReservationItem
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    InventoryNext.InventoryItemDTO,
    {
      InventoryItem: {
        dto: InventoryNext.InventoryItemDTO
      }
      InventoryLevel: {
        dto: InventoryNext.InventoryLevelDTO
      }
      ReservationItem: {
        dto: InventoryNext.ReservationItemDTO
      }
    }
  >(InventoryItem, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IInventoryServiceNext
{
  protected baseRepository_: DAL.RepositoryService

  protected readonly inventoryItemService_: ModulesSdkTypes.InternalModuleService<TInventoryItem>
  protected readonly reservationItemService_: ModulesSdkTypes.InternalModuleService<TReservationItem>
  protected readonly inventoryLevelService_: InventoryLevelService<TInventoryLevel>

  constructor(
    {
      baseRepository,
      inventoryItemService,
      inventoryLevelService,
      reservationItemService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration?: InternalModuleDeclaration
  ) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.inventoryItemService_ = inventoryItemService
    this.inventoryLevelService_ = inventoryLevelService
    this.reservationItemService_ = reservationItemService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  private async ensureInventoryLevels(
    data: (
      | { location_id: string; inventory_item_id: string }
      | { id: string }
    )[],
    context: Context
  ): Promise<InventoryNext.InventoryLevelDTO[]> {
    const [idData, itemLocationData] = partitionArray(
      data,
      ({ id }) => !!id
    ) as [
      { id: string }[],
      { location_id: string; inventory_item_id: string }[]
    ]

    const inventoryLevels = await this.listInventoryLevels(
      {
        $or: [
          { id: idData.filter(({ id }) => !!id).map((e) => e.id) },
          ...itemLocationData,
        ],
      },
      {},
      context
    )

    const inventoryLevelIdMap: Map<string, InventoryNext.InventoryLevelDTO> =
      new Map(inventoryLevels.map((level) => [level.id, level]))

    const inventoryLevelItemLocationMap: Map<
      string,
      Map<string, InventoryNext.InventoryLevelDTO>
    > = inventoryLevels.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()
      inventoryLevelMap.set(curr.location_id, curr)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    const missing = data.filter((i) => {
      if ("id" in i) {
        return !inventoryLevelIdMap.has(i.id)
      }
      return !inventoryLevelItemLocationMap
        .get(i.inventory_item_id)
        ?.has(i.location_id)
    })

    if (missing.length) {
      const error = missing
        .map((missing) => {
          if ("id" in missing) {
            return `Inventory level with id ${missing.id} does not exist`
          }
          return `Item ${missing.inventory_item_id} is not stocked at location ${missing.location_id}`
        })
        .join(", ")

      throw new MedusaError(MedusaError.Types.NOT_FOUND, error)
    }

    return inventoryLevels
  }

  async createReservationItems(
    input: InventoryNext.CreateReservationItemInput[],
    context?: Context
  ): Promise<InventoryNext.ReservationItemDTO[]>
  async createReservationItems(
    input: InventoryNext.CreateReservationItemInput,
    context?: Context
  ): Promise<InventoryNext.ReservationItemDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createReservationItems(
    input:
      | InventoryNext.CreateReservationItemInput[]
      | InventoryNext.CreateReservationItemInput,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryNext.ReservationItemDTO[] | InventoryNext.ReservationItemDTO
  > {
    const toCreate = Array.isArray(input) ? input : [input]

    const checkLevels = toCreate.map(async (item) => {
      if (!!item.allow_backorder) {
        return
      }

      const available = await this.retrieveAvailableQuantity(
        item.inventory_item_id,
        [item.location_id],
        context
      )

      if (available < item.quantity) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Not enough stock available for item ${item.inventory_item_id} at location ${item.location_id}`
        )
      }
    })

    await promiseAll(checkLevels)

    const created = await this.createReservationItems_(toCreate, context)

    context.messageAggregator?.saveRawMessageData(
      created.map((reservationItem) => ({
        eventName: InventoryEvents.reservation_item_created,
        service: this.constructor.name,
        action: CommonEvents.CREATED,
        object: "reservation-item",
        context,
        data: { id: reservationItem.id },
      }))
    )

    const serializedReservations = await this.baseRepository_.serialize<
      InventoryNext.ReservationItemDTO[] | InventoryNext.ReservationItemDTO
    >(created, {
      populate: true,
    })

    return Array.isArray(input)
      ? serializedReservations
      : serializedReservations[0]
  }

  @InjectTransactionManager("baseRepository_")
  async createReservationItems_(
    input: InventoryNext.CreateReservationItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<TReservationItem[]> {
    const inventoryLevels = await this.ensureInventoryLevels(
      input.map(({ location_id, inventory_item_id }) => ({
        location_id,
        inventory_item_id,
      })),
      context
    )
    const created = await this.reservationItemService_.create(input, context)

    const adjustments: Map<string, Map<string, number>> = input.reduce(
      (acc, curr) => {
        const locationMap = acc.get(curr.inventory_item_id) ?? new Map()

        const adjustment = locationMap.get(curr.location_id) ?? 0
        locationMap.set(curr.location_id, adjustment + curr.quantity)

        acc.set(curr.inventory_item_id, locationMap)
        return acc
      },
      new Map()
    )

    const levelAdjustmentUpdates = inventoryLevels.map((level) => {
      const adjustment = adjustments
        .get(level.inventory_item_id)
        ?.get(level.location_id)

      if (!adjustment) {
        return
      }

      return {
        id: level.id,
        reserved_quantity: level.reserved_quantity + adjustment,
      }
    })

    await this.inventoryLevelService_.update(levelAdjustmentUpdates, context)

    return created
  }

  /**
   * Creates an inventory item
   * @param input - the input object
   * @param context
   * @return The created inventory item
   */
  create(
    input: InventoryNext.CreateInventoryItemInput,
    context?: Context
  ): Promise<InventoryNext.InventoryItemDTO>
  create(
    input: InventoryNext.CreateInventoryItemInput[],
    context?: Context
  ): Promise<InventoryNext.InventoryItemDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async create(
    input:
      | InventoryNext.CreateInventoryItemInput
      | InventoryNext.CreateInventoryItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryNext.InventoryItemDTO | InventoryNext.InventoryItemDTO[]
  > {
    const toCreate = Array.isArray(input) ? input : [input]

    const result = await this.createInventoryItems_(toCreate, context)

    context.messageAggregator?.saveRawMessageData(
      result.map((inventoryItem) => ({
        eventName: InventoryEvents.created,
        service: this.constructor.name,
        action: CommonEvents.CREATED,
        object: "inventory-item",
        context,
        data: { id: inventoryItem.id },
      }))
    )

    const serializedItems = await this.baseRepository_.serialize<
      InventoryNext.InventoryItemDTO | InventoryNext.InventoryItemDTO[]
    >(result, {
      populate: true,
    })

    return Array.isArray(input) ? serializedItems : serializedItems[0]
  }

  @InjectTransactionManager("baseRepository_")
  async createInventoryItems_(
    input: InventoryNext.CreateInventoryItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InventoryNext.InventoryItemDTO[]> {
    return await this.inventoryItemService_.create(input)
  }

  createInventoryLevels(
    input: InventoryNext.CreateInventoryLevelInput,
    context?: Context
  ): Promise<InventoryNext.InventoryLevelDTO>
  createInventoryLevels(
    input: InventoryNext.CreateInventoryLevelInput[],
    context?: Context
  ): Promise<InventoryNext.InventoryLevelDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createInventoryLevels(
    input:
      | InventoryNext.CreateInventoryLevelInput[]
      | InventoryNext.CreateInventoryLevelInput,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryNext.InventoryLevelDTO[] | InventoryNext.InventoryLevelDTO
  > {
    const toCreate = Array.isArray(input) ? input : [input]

    const created = await this.createInventoryLevels_(toCreate, context)

    context.messageAggregator?.saveRawMessageData(
      created.map((inventoryLevel) => ({
        eventName: InventoryEvents.inventory_level_created,
        service: this.constructor.name,
        action: CommonEvents.CREATED,
        object: "inventory-level",
        context,
        data: { id: inventoryLevel.id },
      }))
    )

    const serialized = await this.baseRepository_.serialize<
      InventoryNext.InventoryLevelDTO[] | InventoryNext.InventoryLevelDTO
    >(created, {
      populate: true,
    })

    return Array.isArray(input) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  async createInventoryLevels_(
    input: InventoryNext.CreateInventoryLevelInput[],
    @MedusaContext() context: Context = {}
  ): Promise<TInventoryLevel[]> {
    return await this.inventoryLevelService_.create(input, context)
  }

  /**
   * Updates inventory items
   * @param inventoryItemId - the id of the inventory item to update
   * @param input - the input object
   * @param context
   * @return The updated inventory item
   */
  update(
    input: InventoryNext.UpdateInventoryItemInput[],
    context?: Context
  ): Promise<InventoryNext.InventoryItemDTO[]>
  update(
    input: InventoryNext.UpdateInventoryItemInput,
    context?: Context
  ): Promise<InventoryNext.InventoryItemDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async update(
    input:
      | InventoryNext.UpdateInventoryItemInput
      | InventoryNext.UpdateInventoryItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryNext.InventoryItemDTO | InventoryNext.InventoryItemDTO[]
  > {
    const updates = Array.isArray(input) ? input : [input]

    const result = await this.updateInventoryItems_(updates, context)

    context.messageAggregator?.saveRawMessageData(
      result.map((inventoryItem) => ({
        eventName: InventoryEvents.updated,
        service: this.constructor.name,
        action: CommonEvents.UPDATED,
        object: "inventory-item",
        context,
        data: { id: inventoryItem.id },
      }))
    )

    const serializedItems = await this.baseRepository_.serialize<
      InventoryNext.InventoryItemDTO | InventoryNext.InventoryItemDTO[]
    >(result, {
      populate: true,
    })

    return Array.isArray(input) ? serializedItems : serializedItems[0]
  }

  @InjectTransactionManager("baseRepository_")
  async updateInventoryItems_(
    input: (Partial<InventoryNext.CreateInventoryItemInput> & { id: string })[],
    @MedusaContext() context: Context = {}
  ): Promise<TInventoryItem[]> {
    return await this.inventoryItemService_.update(input, context)
  }

  @InjectTransactionManager("baseRepository_")
  @EmitEvents()
  async deleteInventoryItemLevelByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<[object[], Record<string, unknown[]>]> {
    const result = await this.inventoryLevelService_.softDelete(
      { location_id: locationId },
      context
    )

    context.messageAggregator?.saveRawMessageData(
      result[0].map((inventoryLevel) => ({
        eventName: InventoryEvents.inventory_level_deleted,
        service: this.constructor.name,
        action: CommonEvents.DELETED,
        object: "inventory-level",
        context,
        data: { id: inventoryLevel.id },
      }))
    )

    return result
  }

  /**
   * Deletes an inventory level
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param locationId - the id of the location associated with the level
   * @param context
   */
  @InjectTransactionManager("baseRepository_")
  async deleteInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const [inventoryLevel] = await this.inventoryLevelService_.list(
      { inventory_item_id: inventoryItemId, location_id: locationId },
      { take: 1 },
      context
    )

    context.messageAggregator?.saveRawMessageData({
      eventName: InventoryEvents.inventory_level_deleted,
      service: this.constructor.name,
      action: CommonEvents.DELETED,
      object: "inventory-level",
      context,
      data: { id: inventoryLevel.id },
    })

    if (!inventoryLevel) {
      return
    }

    return await this.inventoryLevelService_.delete(inventoryLevel.id, context)
  }

  async updateInventoryLevels(
    updates: InventoryTypes.BulkUpdateInventoryLevelInput[],
    context?: Context
  ): Promise<InventoryNext.InventoryLevelDTO[]>
  async updateInventoryLevels(
    updates: InventoryTypes.BulkUpdateInventoryLevelInput,
    context?: Context
  ): Promise<InventoryNext.InventoryLevelDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateInventoryLevels(
    updates:
      | InventoryTypes.BulkUpdateInventoryLevelInput[]
      | InventoryTypes.BulkUpdateInventoryLevelInput,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryNext.InventoryLevelDTO | InventoryNext.InventoryLevelDTO[]
  > {
    const input = Array.isArray(updates) ? updates : [updates]

    const levels = await this.updateInventoryLevels_(input, context)

    context.messageAggregator?.saveRawMessageData(
      levels.map((inventoryLevel) => ({
        eventName: InventoryEvents.inventory_level_updated,
        service: this.constructor.name,
        action: CommonEvents.UPDATED,
        object: "inventory-level",
        context,
        data: { id: inventoryLevel.id },
      }))
    )

    const updatedLevels = await this.baseRepository_.serialize<
      | InventoryTypes.InventoryNext.InventoryLevelDTO
      | InventoryTypes.InventoryNext.InventoryLevelDTO[]
    >(levels, {
      populate: true,
    })

    return Array.isArray(updates) ? updatedLevels : updatedLevels[0]
  }

  @InjectTransactionManager("baseRepository_")
  async updateInventoryLevels_(
    updates: InventoryTypes.BulkUpdateInventoryLevelInput[],
    @MedusaContext() context: Context = {}
  ) {
    const inventoryLevels = await this.ensureInventoryLevels(
      updates.map(({ location_id, inventory_item_id }) => ({
        location_id,
        inventory_item_id,
      })),
      context
    )

    const levelMap = inventoryLevels.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()
      inventoryLevelMap.set(curr.location_id, curr.id)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    return await this.inventoryLevelService_.update(
      updates.map((update) => {
        const id = levelMap
          .get(update.inventory_item_id)
          .get(update.location_id)

        return { id, ...update }
      }),
      context
    )
  }

  /**
   * Updates a reservation item
   * @param reservationItemId
   * @param input - the input object
   * @param context
   * @param context
   * @return The updated inventory level
   */
  async updateReservationItems(
    input: InventoryNext.UpdateReservationItemInput[],
    context?: Context
  ): Promise<InventoryNext.ReservationItemDTO[]>
  async updateReservationItems(
    input: InventoryNext.UpdateReservationItemInput,
    context?: Context
  ): Promise<InventoryNext.ReservationItemDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateReservationItems(
    input:
      | InventoryNext.UpdateReservationItemInput
      | InventoryNext.UpdateReservationItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryNext.ReservationItemDTO | InventoryNext.ReservationItemDTO[]
  > {
    const update = Array.isArray(input) ? input : [input]

    const result = await this.updateReservationItems_(update, context)

    context.messageAggregator?.saveRawMessageData(
      result.map((reservationItem) => ({
        eventName: InventoryEvents.inventory_level_updated,
        service: this.constructor.name,
        action: CommonEvents.UPDATED,
        object: "reservation-item",
        context,
        data: { id: reservationItem.id },
      }))
    )

    const serialized = await this.baseRepository_.serialize<
      InventoryNext.ReservationItemDTO | InventoryNext.ReservationItemDTO[]
    >(result, {
      populate: true,
    })

    return Array.isArray(input) ? serialized : serialized[0]
  }

  @InjectTransactionManager("baseRepository_")
  async updateReservationItems_(
    input: (InventoryNext.UpdateReservationItemInput & { id: string })[],
    @MedusaContext() context: Context = {}
  ): Promise<TReservationItem[]> {
    const reservationItems = await this.listReservationItems(
      { id: input.map((u) => u.id) },
      {},
      context
    )

    const reservationMap: Map<string, ReservationItemDTO> = new Map(
      reservationItems.map((r) => [r.id, r])
    )

    const adjustments: Map<string, Map<string, number>> = input.reduce(
      (acc, update) => {
        const reservation = reservationMap.get(update.id)
        if (!reservation) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Reservation item with id ${update.id} not found`
          )
        }

        const locationMap = acc.get(reservation.inventory_item_id) ?? new Map()

        if (
          isDefined(update.location_id) &&
          update.location_id !== reservation.location_id
        ) {
          const reservationLocationAdjustment =
            locationMap.get(reservation.location_id) ?? 0

          locationMap.set(
            reservation.location_id,
            reservationLocationAdjustment - reservation.quantity
          )

          const updateLocationAdjustment =
            locationMap.get(update.location_id) ?? 0

          locationMap.set(
            update.location_id,
            updateLocationAdjustment + (update.quantity || reservation.quantity)
          )
        } else if (
          isDefined(update.quantity) &&
          update.quantity !== reservation.quantity
        ) {
          const locationAdjustment =
            locationMap.get(reservation.location_id) ?? 0

          locationMap.set(
            reservation.location_id,
            locationAdjustment + (update.quantity! - reservation.quantity)
          )
        }

        acc.set(reservation.inventory_item_id, locationMap)
        return acc
      },
      new Map()
    )

    const result = await this.reservationItemService_.update(input, context)

    const inventoryLevels = await this.ensureInventoryLevels(
      reservationItems.map((r) => ({
        inventory_item_id: r.inventory_item_id,
        location_id: r.location_id,
      })),
      context
    )

    const levelAdjustmentUpdates = inventoryLevels
      .map((level) => {
        const adjustment = adjustments
          .get(level.inventory_item_id)
          ?.get(level.location_id)

        if (!adjustment) {
          return
        }

        return {
          id: level.id,
          reserved_quantity: level.reserved_quantity + adjustment,
        }
      })
      .filter(Boolean)

    await this.inventoryLevelService_.update(levelAdjustmentUpdates, context)

    return result
  }

  @InjectTransactionManager("baseRepository_")
  @EmitEvents()
  async deleteReservationItemByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const reservations: InventoryNext.ReservationItemDTO[] =
      await this.listReservationItems({ location_id: locationId }, {}, context)

    await this.reservationItemService_.softDelete(
      { location_id: locationId },
      context
    )

    context.messageAggregator?.saveRawMessageData(
      reservations.map((reservationItem) => ({
        eventName: InventoryEvents.reservation_item_deleted,
        service: this.constructor.name,
        action: CommonEvents.DELETED,
        object: "reservation-item",
        context,
        data: { id: reservationItem.id },
      }))
    )

    await this.adjustInventoryLevelsForReservationsDeletion(
      reservations,
      context
    )
  }

  /**
   * Deletes reservation items by line item
   * @param lineItemId - the id of the line item associated with the reservation item
   * @param context
   */

  @InjectTransactionManager("baseRepository_")
  @EmitEvents()
  async deleteReservationItemsByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const reservations: InventoryNext.ReservationItemDTO[] =
      await this.listReservationItems({ line_item_id: lineItemId }, {}, context)

    await this.reservationItemService_.softDelete(
      { line_item_id: lineItemId },
      context
    )

    await this.adjustInventoryLevelsForReservationsDeletion(
      reservations,
      context
    )

    context.messageAggregator?.saveRawMessageData(
      reservations.map((reservationItem) => ({
        eventName: InventoryEvents.reservation_item_deleted,
        service: this.constructor.name,
        action: CommonEvents.DELETED,
        object: "reservation-item",
        context,
        data: { id: reservationItem.id },
      }))
    )
  }

  /**
   * Deletes reservation items by line item
   * @param lineItemId - the id of the line item associated with the reservation item
   * @param context
   */

  @InjectTransactionManager("baseRepository_")
  @EmitEvents()
  async restoreReservationItemsByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const reservations: InventoryNext.ReservationItemDTO[] =
      await this.listReservationItems({ line_item_id: lineItemId }, {}, context)

    await this.reservationItemService_.restore(
      { line_item_id: lineItemId },
      context
    )

    await this.adjustInventoryLevelsForReservationsRestore(
      reservations,
      context
    )

    context.messageAggregator?.saveRawMessageData(
      reservations.map((reservationItem) => ({
        eventName: InventoryEvents.reservation_item_created,
        service: this.constructor.name,
        action: CommonEvents.CREATED,
        object: "reservation-item",
        context,
        data: { id: reservationItem.id },
      }))
    )
  }

  /**
   * Adjusts the inventory level for a given inventory item and location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationId - the id of the location
   * @param adjustment - the number to adjust the inventory by (can be positive or negative)
   * @param context
   * @return The updated inventory level
   * @throws when the inventory level is not found
   */
  adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    context: Context
  ): Promise<InventoryNext.InventoryLevelDTO>

  adjustInventory(
    data: {
      inventoryItemId: string
      locationId: string
      adjustment: number
    }[],
    context: Context
  ): Promise<InventoryNext.InventoryLevelDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async adjustInventory(
    inventoryItemIdOrData: string | any,
    locationId?: string | Context,
    adjustment?: number,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryNext.InventoryLevelDTO | InventoryNext.InventoryLevelDTO[]
  > {
    let all: any = inventoryItemIdOrData

    if (isString(inventoryItemIdOrData)) {
      all = [
        {
          inventoryItemId: inventoryItemIdOrData,
          locationId,
          adjustment,
        },
      ]
    }

    const results: TInventoryLevel[] = []

    for (const data of all) {
      const result = await this.adjustInventory_(
        data.inventoryItemId,
        data.locationId,
        data.adjustment,
        context
      )
      results.push(result)

      context.messageAggregator?.saveRawMessageData({
        eventName: InventoryEvents.inventory_level_updated,
        service: this.constructor.name,
        action: CommonEvents.UPDATED,
        object: "inventory-level",
        context,
        data: { id: result.id },
      })
    }

    return await this.baseRepository_.serialize<InventoryNext.InventoryLevelDTO>(
      Array.isArray(inventoryItemIdOrData) ? results : results[0],
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async adjustInventory_(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    @MedusaContext() context: Context = {}
  ): Promise<TInventoryLevel> {
    const inventoryLevel = await this.retrieveInventoryLevelByItemAndLocation(
      inventoryItemId,
      locationId,
      context
    )

    const result = await this.inventoryLevelService_.update(
      {
        id: inventoryLevel.id,
        stocked_quantity: inventoryLevel.stocked_quantity + adjustment,
      },
      context
    )

    return result[0]
  }

  @InjectManager("baseRepository_")
  async retrieveInventoryLevelByItemAndLocation(
    inventoryItemId: string,
    locationId: string,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryNext.InventoryLevelDTO> {
    const [inventoryLevel] = await this.listInventoryLevels(
      { inventory_item_id: inventoryItemId, location_id: locationId },
      { take: 1 },
      context
    )

    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for item ${inventoryItemId} and location ${locationId} not found`
      )
    }

    return inventoryLevel
  }

  /**
   * Retrieves the available quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param context
   * @return The available quantity
   * @throws when the inventory item is not found
   */
  @InjectManager("baseRepository_")
  async retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: Context = {}
  ): Promise<number> {
    if (locationIds.length === 0) {
      return 0
    }

    await this.inventoryItemService_.retrieve(
      inventoryItemId,
      {
        select: ["id"],
      },
      context
    )

    const availableQuantity =
      await this.inventoryLevelService_.getAvailableQuantity(
        inventoryItemId,
        locationIds,
        context
      )

    return availableQuantity
  }

  /**
   * Retrieves the stocked quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param context
   * @return The stocked quantity
   * @throws when the inventory item is not found
   */
  @InjectManager("baseRepository_")
  async retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: Context = {}
  ): Promise<number> {
    if (locationIds.length === 0) {
      return 0
    }

    // Throws if item does not exist
    await this.inventoryItemService_.retrieve(
      inventoryItemId,
      {
        select: ["id"],
      },
      context
    )

    const stockedQuantity =
      await this.inventoryLevelService_.retrieveStockedQuantity(
        inventoryItemId,
        locationIds,
        context
      )

    return stockedQuantity
  }

  /**
   * Retrieves the reserved quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param context
   * @return The reserved quantity
   * @throws when the inventory item is not found
   */
  @InjectManager("baseRepository_")
  async retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: Context = {}
  ): Promise<number> {
    // Throws if item does not exist
    await this.inventoryItemService_.retrieve(
      inventoryItemId,
      {
        select: ["id"],
      },
      context
    )

    if (locationIds.length === 0) {
      return 0
    }

    const reservedQuantity =
      await this.inventoryLevelService_.getReservedQuantity(
        inventoryItemId,
        locationIds,
        context
      )

    return reservedQuantity
  }

  /**
   * Confirms whether there is sufficient inventory for a given quantity of a given inventory item in a given location.
   * @param inventoryItemId - the id of the inventory item
   * @param locationIds - the ids of the locations to check
   * @param quantity - the quantity to check
   * @param context
   * @return Whether there is sufficient inventory
   */
  @InjectManager("baseRepository_")
  async confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number,
    @MedusaContext() context: Context = {}
  ): Promise<boolean> {
    const availableQuantity = await this.retrieveAvailableQuantity(
      inventoryItemId,
      locationIds,
      context
    )
    return availableQuantity >= quantity
  }

  private async adjustInventoryLevelsForReservationsDeletion(
    reservations: ReservationItemDTO[],
    context: Context
  ): Promise<void> {
    await this.adjustInventoryLevelsForReservations_(
      reservations,
      true,
      context
    )
  }

  private async adjustInventoryLevelsForReservationsRestore(
    reservations: ReservationItemDTO[],
    context: Context
  ): Promise<void> {
    await this.adjustInventoryLevelsForReservations_(
      reservations,
      false,
      context
    )
  }

  private async adjustInventoryLevelsForReservations_(
    reservations: ReservationItemDTO[],
    isDelete: boolean,
    context: Context
  ): Promise<void> {
    const multiplier = isDelete ? -1 : 1
    const inventoryLevels = await this.ensureInventoryLevels(
      reservations.map((r) => ({
        inventory_item_id: r.inventory_item_id,
        location_id: r.location_id,
      })),
      context
    )

    const inventoryLevelAdjustments: Map<
      string,
      Map<string, number>
    > = reservations.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()

      const adjustment = inventoryLevelMap.has(curr.location_id)
        ? inventoryLevelMap.get(curr.location_id) + curr.quantity * multiplier
        : curr.quantity * multiplier

      inventoryLevelMap.set(curr.location_id, adjustment)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    const levelAdjustmentUpdates = inventoryLevels.map((level) => {
      const adjustment = inventoryLevelAdjustments
        .get(level.inventory_item_id)
        ?.get(level.location_id)

      if (!adjustment) {
        return
      }

      return {
        id: level.id,
        reserved_quantity: level.reserved_quantity + adjustment,
      }
    })

    await this.inventoryLevelService_.update(levelAdjustmentUpdates, context)
  }
}
