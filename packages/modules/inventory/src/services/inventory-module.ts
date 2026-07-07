import {
  BigNumberInput,
  Context,
  DAL,
  IInventoryService,
  InferEntityType,
  InternalModuleDeclaration,
  InventoryTypes,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ReservationItemDTO,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/framework/types"
import {
  arrayDifference,
  BigNumber,
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isString,
  MathBN,
  MedusaContext,
  MedusaError,
  MedusaService,
  partitionArray,
} from "@medusajs/framework/utils"
import { InventoryItem, InventoryLevel, ReservationItem } from "@models"
import { joinerConfig } from "../joiner-config"
import { applyEntityHooks } from "../utils/apply-decorators"
import InventoryLevelService from "./inventory-level"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  inventoryItemService: ModulesSdkTypes.IMedusaInternalService<any>
  inventoryLevelService: InventoryLevelService
  reservationItemService: ModulesSdkTypes.IMedusaInternalService<any>
}

type InventoryItemCheckLevel = {
  id?: string
  location_id: string
  inventory_item_id: string
  quantity?: BigNumberInput
  allow_backorder?: boolean
}

applyEntityHooks()

export default class InventoryModuleService
  extends MedusaService<{
    InventoryItem: {
      dto: InventoryTypes.InventoryItemDTO
    }
    InventoryLevel: {
      dto: InventoryTypes.InventoryLevelDTO
    }
    ReservationItem: {
      dto: InventoryTypes.ReservationItemDTO
    }
  }>({
    InventoryItem,
    InventoryLevel,
    ReservationItem,
  })
  implements IInventoryService
{
  protected baseRepository_: DAL.RepositoryService

  protected readonly inventoryItemService_: ModulesSdkTypes.IMedusaInternalService<
    typeof InventoryItem
  >
  protected readonly reservationItemService_: ModulesSdkTypes.IMedusaInternalService<
    typeof ReservationItem
  >
  protected readonly inventoryLevelService_: InventoryLevelService

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
    data: InventoryItemCheckLevel[],
    options?: {
      validateQuantityAtLocation?: boolean
    },
    context?: Context
  ): Promise<InventoryTypes.InventoryLevelDTO[]> {
    options ??= {}
    const validateQuantityAtLocation =
      options.validateQuantityAtLocation ?? false

    const data_ = data.map((dt: any) => ({
      location_id: dt.location_id,
      inventory_item_id: dt.inventory_item_id,
    })) as InventoryItemCheckLevel[]

    const [idData, itemLocationData] = partitionArray(
      data_,
      ({ id }) => !!id
    ) as [
      { id: string }[],
      { location_id: string; inventory_item_id: string }[]
    ]

    const inventoryLevels = await this.inventoryLevelService_.list(
      {
        $or: [
          { id: idData.filter(({ id }) => !!id).map((e) => e.id) },
          ...itemLocationData,
        ],
      },
      {},
      context
    )

    const inventoryLevelIdMap: Map<string, InventoryTypes.InventoryLevelDTO> =
      new Map(inventoryLevels.map((level) => [level.id, level]))

    const inventoryLevelItemLocationMap: Map<
      string,
      Map<string, InventoryTypes.InventoryLevelDTO>
    > = inventoryLevels.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()
      inventoryLevelMap.set(curr.location_id, curr)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    const missing = data.filter((item) => {
      if (item.id) {
        return !inventoryLevelIdMap.has(item.id!)
      }

      return !inventoryLevelItemLocationMap
        .get(item.inventory_item_id)
        ?.has(item.location_id)
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

    if (validateQuantityAtLocation) {
      for (const item of data) {
        if (!!item.allow_backorder) {
          continue
        }

        const locations = inventoryLevelItemLocationMap.get(
          item.inventory_item_id
        )!

        const level = locations?.get(item.location_id)!

        if (MathBN.lt(level.available_quantity, item.quantity!)) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Not enough stock available for item ${item.inventory_item_id} at location ${item.location_id}`
          )
        }
      }
    }

    return inventoryLevels
  }

  // reserved_quantity should solely be handled through creating & updating reservation items
  // We sanitize the inputs here to prevent that from being used to update it
  private sanitizeInventoryLevelInput<TDTO = unknown>(
    input: (TDTO & {
      reserved_quantity?: BigNumberInput
    })[]
  ): TDTO[] {
    return input.map((input) => {
      const { reserved_quantity, ...validInput } = input

      return validInput as TDTO
    })
  }

  private sanitizeInventoryItemInput<TDTO = unknown>(
    input: (TDTO & {
      location_levels?: object[]
    })[]
  ): TDTO[] {
    return input.map((input) => {
      const { location_levels, ...validInput } = input

      return validInput as TDTO
    })
  }

  // @ts-expect-error
  async createReservationItems(
    input: InventoryTypes.CreateReservationItemInput[],
    context?: Context
  ): Promise<InventoryTypes.ReservationItemDTO[]>
  // @ts-expect-error
  async createReservationItems(
    input: InventoryTypes.CreateReservationItemInput,
    context?: Context
  ): Promise<InventoryTypes.ReservationItemDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createReservationItems(
    input:
      | InventoryTypes.CreateReservationItemInput[]
      | InventoryTypes.CreateReservationItemInput,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryTypes.ReservationItemDTO[] | InventoryTypes.ReservationItemDTO
  > {
    const toCreate = Array.isArray(input) ? input : [input]
    const created = await this.createReservationItems_(toCreate, context)

    const serializedReservations = await this.baseRepository_.serialize<
      InventoryTypes.ReservationItemDTO[] | InventoryTypes.ReservationItemDTO
    >(created)

    return Array.isArray(input)
      ? serializedReservations
      : serializedReservations[0]
  }

  @InjectTransactionManager()
  async createReservationItems_(
    input: InventoryTypes.CreateReservationItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InferEntityType<typeof ReservationItem>[]> {
    const inventoryLevels = await this.ensureInventoryLevels(
      input.map(
        ({ location_id, inventory_item_id, quantity, allow_backorder }) => ({
          location_id,
          inventory_item_id,
          quantity,
          allow_backorder,
        })
      ),
      {
        validateQuantityAtLocation: true,
      },
      context
    )

    const created = await this.reservationItemService_.create(input, context)

    const adjustments: Map<string, Map<string, number>> = input.reduce(
      (acc, curr) => {
        const locationMap = acc.get(curr.inventory_item_id) ?? new Map()

        const adjustment = locationMap.get(curr.location_id) ?? 0
        locationMap.set(curr.location_id, MathBN.add(adjustment, curr.quantity))

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
        reserved_quantity: MathBN.add(level.reserved_quantity, adjustment),
      }
    })

    await this.inventoryLevelService_.update(levelAdjustmentUpdates, context)

    return created
  }

  // @ts-expect-error
  createInventoryItems(
    input: InventoryTypes.CreateInventoryItemInput,
    context?: Context
  ): Promise<InventoryTypes.InventoryItemDTO>
  createInventoryItems(
    input: InventoryTypes.CreateInventoryItemInput[],
    context?: Context
  ): Promise<InventoryTypes.InventoryItemDTO[]>

  @InjectManager()
  @EmitEvents()
  async createInventoryItems(
    input:
      | InventoryTypes.CreateInventoryItemInput
      | InventoryTypes.CreateInventoryItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryTypes.InventoryItemDTO | InventoryTypes.InventoryItemDTO[]
  > {
    const toCreate = this.sanitizeInventoryItemInput(
      Array.isArray(input) ? input : [input]
    )
    const result = await this.createInventoryItems_(toCreate, context)

    const serializedItems = await this.baseRepository_.serialize<
      InventoryTypes.InventoryItemDTO | InventoryTypes.InventoryItemDTO[]
    >(result)

    return Array.isArray(input) ? serializedItems : serializedItems[0]
  }

  @InjectTransactionManager()
  async createInventoryItems_(
    input: InventoryTypes.CreateInventoryItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InventoryTypes.InventoryItemDTO[]> {
    return await this.inventoryItemService_.create(input, context)
  }

  // @ts-ignore
  createInventoryLevels(
    input: InventoryTypes.CreateInventoryLevelInput,
    context?: Context
  ): Promise<InventoryTypes.InventoryLevelDTO>
  // @ts-expect-error
  createInventoryLevels(
    input: InventoryTypes.CreateInventoryLevelInput[],
    context?: Context
  ): Promise<InventoryTypes.InventoryLevelDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createInventoryLevels(
    input:
      | InventoryTypes.CreateInventoryLevelInput[]
      | InventoryTypes.CreateInventoryLevelInput,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryTypes.InventoryLevelDTO[] | InventoryTypes.InventoryLevelDTO
  > {
    const toCreate = this.sanitizeInventoryLevelInput(
      Array.isArray(input) ? input : [input]
    )

    const created = await this.createInventoryLevels_(toCreate, context)

    const serialized = await this.baseRepository_.serialize<
      InventoryTypes.InventoryLevelDTO[] | InventoryTypes.InventoryLevelDTO
    >(created)

    return Array.isArray(input) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  async createInventoryLevels_(
    input: InventoryTypes.CreateInventoryLevelInput[],
    @MedusaContext() context: Context = {}
  ): Promise<InferEntityType<typeof InventoryLevel>[]> {
    return await this.inventoryLevelService_.create(input, context)
  }

  // @ts-expect-error
  updateInventoryItems(
    input: InventoryTypes.UpdateInventoryItemInput[],
    context?: Context
  ): Promise<InventoryTypes.InventoryItemDTO[]>
  // @ts-expect-error
  updateInventoryItems(
    input: InventoryTypes.UpdateInventoryItemInput,
    context?: Context
  ): Promise<InventoryTypes.InventoryItemDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateInventoryItems(
    input:
      | InventoryTypes.UpdateInventoryItemInput
      | InventoryTypes.UpdateInventoryItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryTypes.InventoryItemDTO | InventoryTypes.InventoryItemDTO[]
  > {
    const updates = this.sanitizeInventoryItemInput(
      Array.isArray(input) ? input : [input]
    )

    const result = await this.updateInventoryItems_(updates, context)

    const serializedItems = await this.baseRepository_.serialize<
      InventoryTypes.InventoryItemDTO | InventoryTypes.InventoryItemDTO[]
    >(result)

    return Array.isArray(input) ? serializedItems : serializedItems[0]
  }

  @InjectTransactionManager()
  async updateInventoryItems_(
    input: (Partial<InventoryTypes.CreateInventoryItemInput> & {
      id: string
    })[],
    @MedusaContext() context: Context = {}
  ): Promise<InferEntityType<typeof InventoryItem>[]> {
    return await this.inventoryItemService_.update(input, context)
  }

  @InjectManager()
  @EmitEvents()
  async deleteInventoryItemLevelByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<[object[], Record<string, unknown[]>]> {
    const result = await this.inventoryLevelService_.softDelete(
      { location_id: locationId },
      context
    )

    return result
  }

  /**
   * Deletes an inventory level
   * @param inventoryItemId - the id of the inventory item associated with the level
   * @param locationId - the id of the location associated with the level
   * @param context
   */
  @InjectTransactionManager()
  @EmitEvents()
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

    if (!inventoryLevel) {
      return
    }

    await this.inventoryLevelService_.delete(inventoryLevel.id, context)
  }

  // @ts-ignore
  async updateInventoryLevels(
    updates: InventoryTypes.UpdateInventoryLevelInput[],
    context?: Context
  ): Promise<InventoryTypes.InventoryLevelDTO[]>
  // @ts-expect-error
  async updateInventoryLevels(
    updates: InventoryTypes.UpdateInventoryLevelInput,
    context?: Context
  ): Promise<InventoryTypes.InventoryLevelDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateInventoryLevels(
    updates:
      | InventoryTypes.UpdateInventoryLevelInput[]
      | InventoryTypes.UpdateInventoryLevelInput,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryTypes.InventoryLevelDTO | InventoryTypes.InventoryLevelDTO[]
  > {
    const input = this.sanitizeInventoryLevelInput(
      Array.isArray(updates) ? updates : [updates]
    )

    const levels = await this.updateInventoryLevels_(input, context)

    const updatedLevels = await this.baseRepository_.serialize<
      InventoryTypes.InventoryLevelDTO | InventoryTypes.InventoryLevelDTO[]
    >(levels)

    return Array.isArray(updates) ? updatedLevels : updatedLevels[0]
  }

  @InjectTransactionManager()
  async updateInventoryLevels_(
    updates: InventoryTypes.UpdateInventoryLevelInput[],
    @MedusaContext() context: Context = {}
  ) {
    const inventoryLevels = await this.ensureInventoryLevels(
      updates.map(({ location_id, inventory_item_id }) => ({
        location_id,
        inventory_item_id,
      })),
      undefined,
      context
    )

    const levelMap = inventoryLevels.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()
      inventoryLevelMap.set(curr.location_id, curr.id)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    const updatesWithIds = updates.map((update) => {
      const id = levelMap.get(update.inventory_item_id).get(update.location_id)

      return { id, ...update }
    })

    return await this.inventoryLevelService_.update(updatesWithIds, context)
  }

  /**
   * Updates a reservation item
   * @param reservationItemId
   * @param input - the input object
   * @param context
   * @param context
   * @return The updated inventory level
   */
  // @ts-expect-error
  async updateReservationItems(
    input: InventoryTypes.UpdateReservationItemInput[],
    context?: Context
  ): Promise<InventoryTypes.ReservationItemDTO[]>
  // @ts-expect-error
  async updateReservationItems(
    input: InventoryTypes.UpdateReservationItemInput,
    context?: Context
  ): Promise<InventoryTypes.ReservationItemDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateReservationItems(
    input:
      | InventoryTypes.UpdateReservationItemInput
      | InventoryTypes.UpdateReservationItemInput[],
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryTypes.ReservationItemDTO | InventoryTypes.ReservationItemDTO[]
  > {
    const update = Array.isArray(input) ? input : [input]
    const result = await this.updateReservationItems_(update, context)

    const serialized = await this.baseRepository_.serialize<
      InventoryTypes.ReservationItemDTO | InventoryTypes.ReservationItemDTO[]
    >(result)

    return Array.isArray(input) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  async updateReservationItems_(
    input: (InventoryTypes.UpdateReservationItemInput & { id: string })[],
    @MedusaContext() context: Context = {}
  ): Promise<InferEntityType<typeof ReservationItem>[]> {
    const ids = input.map((u) => u.id)
    const reservationItems = await this.reservationItemService_.list(
      { id: ids },
      {},
      context
    )

    const diff = arrayDifference(
      ids,
      reservationItems.map((i) => i.id)
    )

    if (diff.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Reservation item with id ${diff.join(", ")} not found`
      )
    }

    const reservationMap: Map<string, ReservationItemDTO> = new Map(
      reservationItems.map((r) => [r.id, r])
    )

    const adjustments: Map<string, Map<string, number>> = input.reduce(
      (acc, update) => {
        const reservation = reservationMap.get(update.id)!
        const locationMap = acc.get(reservation.inventory_item_id) ?? new Map()

        if (
          isDefined(update.location_id) &&
          update.location_id !== reservation.location_id
        ) {
          const reservationLocationAdjustment =
            locationMap.get(reservation.location_id) ?? 0

          locationMap.set(
            reservation.location_id,
            MathBN.sub(reservationLocationAdjustment, reservation.quantity)
          )

          const updateLocationAdjustment =
            locationMap.get(update.location_id) ?? 0

          locationMap.set(
            update.location_id,
            MathBN.add(
              updateLocationAdjustment,
              update.quantity || reservation.quantity
            )
          )
        } else if (
          isDefined(update.quantity) &&
          !MathBN.eq(update.quantity, reservation.quantity)
        ) {
          const locationAdjustment =
            locationMap.get(reservation.location_id) ?? 0

          locationMap.set(
            reservation.location_id,
            MathBN.add(
              locationAdjustment,
              MathBN.sub(update.quantity!, reservation.quantity)
            )
          )
        }

        acc.set(reservation.inventory_item_id, locationMap)

        return acc
      },
      new Map()
    )
    const availabilityData = input.map((data) => {
      const reservation = reservationMap.get(data.id)!

      let adjustment = data.quantity
        ? MathBN.sub(data.quantity, reservation.quantity)
        : 0

      if (MathBN.lt(adjustment, 0)) {
        adjustment = 0
      }

      return {
        inventory_item_id: reservation.inventory_item_id,
        location_id: data.location_id ?? reservation.location_id,
        quantity: adjustment,
        allow_backorder:
          data.allow_backorder || reservation.allow_backorder || false,
      }
    })

    const inventoryLevels = await this.ensureInventoryLevels(
      availabilityData,
      {
        validateQuantityAtLocation: true,
      },
      context
    )

    const result = await this.reservationItemService_.update(input, context)

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
          reserved_quantity: MathBN.add(level.reserved_quantity, adjustment),
        }
      })
      .filter(Boolean)

    await this.inventoryLevelService_.update(levelAdjustmentUpdates, context)

    return result
  }

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async deleteReservationItems(
    ids: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.deleteReservationItems_(ids, context)
  }

  @InjectTransactionManager()
  protected async deleteReservationItems_(
    ids: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const reservations: InventoryTypes.ReservationItemDTO[] =
      await this.reservationItemService_.list({ id: ids }, {}, context)

    await super.deleteReservationItems(ids, context)

    await this.adjustInventoryLevelsForReservationsDeletion(
      reservations,
      context
    )
  }

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async softDeleteReservationItems(
    ids: string | string[],
    config?: SoftDeleteReturn<string>,
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.softDeleteReservationItems_(ids, config, context)
  }

  @InjectTransactionManager()
  protected async softDeleteReservationItems_(
    ids: string | string[],
    config?: SoftDeleteReturn<string>,
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const reservations: InventoryTypes.ReservationItemDTO[] =
      await this.reservationItemService_.list({ id: ids }, {}, context)

    await super.softDeleteReservationItems(ids, config, context)

    await this.adjustInventoryLevelsForReservationsDeletion(
      reservations,
      context
    )
  }

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async restoreReservationItems(
    ids: string | string[],
    config?: RestoreReturn<string>,
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.restoreReservationItems_(ids, config, context)
  }

  @InjectTransactionManager()
  protected async restoreReservationItems_(
    ids: string | string[],
    config?: RestoreReturn<string>,
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    await super.restoreReservationItems({ id: ids }, config, context)

    const reservations: InventoryTypes.ReservationItemDTO[] =
      await super.listReservationItems({ id: ids }, {}, context)

    await this.adjustInventoryLevelsForReservationsRestore(
      reservations,
      context
    )
  }

  @InjectManager()
  @EmitEvents()
  async deleteReservationItemByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.deleteReservationItemByLocationId_(locationId, context)
  }

  @InjectTransactionManager()
  protected async deleteReservationItemByLocationId_(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const reservations: InventoryTypes.ReservationItemDTO[] =
      await this.reservationItemService_.list(
        { location_id: locationId },
        {},
        context
      )

    await this.reservationItemService_.softDelete(
      { location_id: locationId },
      context
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

  @InjectManager()
  @EmitEvents()
  async deleteReservationItemsByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.deleteReservationItemsByLineItem_(lineItemId, context)
  }

  @InjectTransactionManager()
  protected async deleteReservationItemsByLineItem_(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    const reservations: InventoryTypes.ReservationItemDTO[] =
      await this.reservationItemService_.list(
        { line_item_id: lineItemId },
        {},
        context
      )

    await this.reservationItemService_.softDelete(
      { line_item_id: lineItemId },
      context
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

  @InjectManager()
  @EmitEvents()
  async restoreReservationItemsByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.restoreReservationItemsByLineItem_(lineItemId, context)
  }

  @InjectTransactionManager()
  protected async restoreReservationItemsByLineItem_(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    await this.reservationItemService_.restore(
      { line_item_id: lineItemId },
      context
    )

    const reservations: InventoryTypes.ReservationItemDTO[] =
      await this.reservationItemService_.list(
        { line_item_id: lineItemId },
        {},
        context
      )

    await this.adjustInventoryLevelsForReservationsRestore(
      reservations,
      context
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
    adjustment: BigNumberInput,
    context: Context
  ): Promise<InventoryTypes.InventoryLevelDTO>

  adjustInventory(
    data: {
      inventoryItemId: string
      locationId: string
      adjustment: BigNumberInput
    }[],
    context: Context
  ): Promise<InventoryTypes.InventoryLevelDTO[]>

  @InjectManager()
  @EmitEvents()
  async adjustInventory(
    inventoryItemIdOrData: string | any,
    locationId?: string | Context,
    adjustment?: BigNumberInput,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryTypes.InventoryLevelDTO | InventoryTypes.InventoryLevelDTO[]
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

    const results: InferEntityType<typeof InventoryLevel>[] = []

    for (const data of all) {
      const result = await this.adjustInventory_(
        data.inventoryItemId,
        data.locationId,
        data.adjustment,
        context
      )
      results.push(result)
    }

    return await this.baseRepository_.serialize<InventoryTypes.InventoryLevelDTO>(
      Array.isArray(inventoryItemIdOrData) ? results : results[0]
    )
  }

  @InjectTransactionManager()
  async adjustInventory_(
    inventoryItemId: string,
    locationId: string,
    adjustment: BigNumberInput,
    @MedusaContext() context: Context = {}
  ): Promise<InferEntityType<typeof InventoryLevel>> {
    const [inventoryLevel] = await this.inventoryLevelService_.list(
      { inventory_item_id: inventoryItemId, location_id: locationId },
      {},
      context
    )

    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for item ${inventoryItemId} and location ${locationId} not found`
      )
    }

    const result = await this.inventoryLevelService_.update(
      {
        id: inventoryLevel.id,
        stocked_quantity: MathBN.add(
          inventoryLevel.stocked_quantity,
          adjustment
        ),
      },
      context
    )

    return result
  }

  @InjectManager()
  async retrieveInventoryLevelByItemAndLocation(
    inventoryItemId: string,
    locationId: string,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryTypes.InventoryLevelDTO> {
    const [inventoryLevel] = await this.listInventoryLevels(
      { inventory_item_id: inventoryItemId, location_id: locationId },
      {},
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
  @InjectManager()
  async retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: Context = {}
  ): Promise<BigNumber> {
    if (locationIds.length === 0) {
      return new BigNumber(0)
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
  @InjectManager()
  async retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: Context = {}
  ): Promise<BigNumber> {
    if (locationIds.length === 0) {
      return new BigNumber(0)
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
  @InjectManager()
  async retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    @MedusaContext() context: Context = {}
  ): Promise<BigNumber> {
    // Throws if item does not exist
    await this.inventoryItemService_.retrieve(
      inventoryItemId,
      {
        select: ["id"],
      },
      context
    )

    if (locationIds.length === 0) {
      return new BigNumber(0)
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
  @InjectManager()
  async confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: BigNumberInput,
    @MedusaContext() context: Context = {}
  ): Promise<boolean> {
    const availableQuantity = await this.retrieveAvailableQuantity(
      inventoryItemId,
      locationIds,
      context
    )
    return MathBN.gte(availableQuantity, quantity)
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
      undefined,
      context
    )

    const inventoryLevelAdjustments: Map<
      string,
      Map<string, number>
    > = reservations.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()

      const adjustment = inventoryLevelMap.has(curr.location_id)
        ? MathBN.add(
            inventoryLevelMap.get(curr.location_id),
            MathBN.mult(curr.quantity, multiplier)
          )
        : MathBN.mult(curr.quantity, multiplier)

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
        reserved_quantity: MathBN.add(level.reserved_quantity, adjustment),
      }
    })

    await this.inventoryLevelService_.update(levelAdjustmentUpdates, context)
  }
}
