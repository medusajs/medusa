import { InternalModuleDeclaration } from "@medusajs/modules-sdk"
import {
  Context,
  IInventoryServiceNext,
  InventoryTypes,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  InventoryNext,
} from "@medusajs/types"
import { MedusaContext, MedusaError, ModulesSdkUtils } from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { InventoryItem, InventoryLevel, ReservationItem } from "@models"
import { DAL } from "@medusajs/types"
import { InjectTransactionManager } from "@medusajs/utils"
import { InjectManager } from "@medusajs/utils"
import InventoryLevelService from "./inventory-level"
import ReservationItemService from "./reservation-item"
import { partitionArray } from "@medusajs/utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  inventoryItemService: ModulesSdkTypes.InternalModuleService<any>
  inventoryLevelService: InventoryLevelService<any>
  reservationItemService: ReservationItemService<any>
}

const generateMethodForModels = [
  { model: InventoryItem, singular: "InventoryItem", plural: "InventoryItems" },
  {
    model: InventoryLevel,
    singular: "InventoryLevel",
    plural: "InventoryLevels",
  },
  {
    model: ReservationItem,
    singular: "ReservationItem",
    plural: "ReservationItems",
  },
]

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
        singular: "InventoryItem"
        plural: "InventoryItems"
      }
      InventoryLevel: {
        dto: InventoryNext.InventoryLevelDTO
        singular: "InventoryLevel"
        plural: "InventoryLevels"
      }
      ReservationItem: {
        dto: InventoryNext.ReservationItemDTO
        singular: "ReservationItem"
        plural: "ReservationItems"
      }
    }
  >(InventoryItem, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IInventoryServiceNext
{
  protected baseRepository_: DAL.RepositoryService

  protected readonly inventoryItemService_: ModulesSdkTypes.InternalModuleService<TInventoryItem>
  protected readonly reservationItemService_: ReservationItemService<TReservationItem>
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

  @InjectTransactionManager("baseRepository_")
  private async ensureInventoryLevels(
    data: { location_id: string; inventory_item_id: string; id?: string }[],
    @MedusaContext() context: Context = {}
  ): Promise<InventoryNext.InventoryLevelDTO[]> {
    const [idData, itemLocationData] = partitionArray(data, ({ id }) => !!id)
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

    const inventoryLevelMap: Map<
      string,
      Map<string, InventoryNext.InventoryLevelDTO>
    > = inventoryLevels.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()
      inventoryLevelMap.set(curr.location_id, curr)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    const missing = data.filter(
      (i) => !inventoryLevelMap.get(i.inventory_item_id)?.get(i.location_id)
    )

    if (missing.length) {
      const error = missing
        .map((missing) => {
          return `Item ${missing.inventory_item_id} is not stocked at location ${missing.location_id}`
        })
        .join(", ")
      throw new MedusaError(MedusaError.Types.NOT_FOUND, error)
    }

    return inventoryLevels.map(
      (i) => inventoryLevelMap.get(i.inventory_item_id)!.get(i.location_id)!
    )
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
  async createReservationItems(
    input:
      | InventoryNext.CreateReservationItemInput[]
      | InventoryNext.CreateReservationItemInput,
    @MedusaContext() context: Context = {}
  ): Promise<
    InventoryNext.ReservationItemDTO[] | InventoryNext.ReservationItemDTO
  > {
    const toCreate = Array.isArray(input) ? input : [input]

    const created = await this.createReservationItems_(toCreate, context)

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
    await this.ensureInventoryLevels(input, context)

    return await this.reservationItemService_.create(input, context)
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

    const serializedItems = await this.baseRepository_.serialize<
      InventoryNext.InventoryItemDTO | InventoryNext.InventoryItemDTO[]
    >(result, {
      populate: true,
    })

    return Array.isArray(input) ? serializedItems : serializedItems[0]
  }

  @InjectTransactionManager("baseRepository_")
  async createInventoryItems_(
    input: InventoryNext.CreateInventoryItemInput,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryNext.InventoryItemDTO> {
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
  async update(
    input:
      | InventoryNext.UpdateInventoryItemInput
      | InventoryNext.UpdateInventoryItemInput[],
    context?: Context
  ): Promise<
    InventoryNext.InventoryItemDTO | InventoryNext.InventoryItemDTO[]
  > {
    const updates = Array.isArray(input) ? input : [input]

    const result = await this.updateInventoryItems_(updates, context)

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
  async deleteInventoryItemLevelByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.inventoryLevelService_.deleteByLocationId(
      locationId,
      context
    )
  }

  @InjectTransactionManager("baseRepository_")
  async deleteReservationItemByLocationId(
    locationId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.reservationItemService_.deleteByLocationId(
      locationId,
      context
    )
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
  async updateInventoryLevels(
    updates:
      | InventoryTypes.BulkUpdateInventoryLevelInput[]
      | InventoryTypes.BulkUpdateInventoryLevelInput,
    context?: Context
  ): Promise<
    InventoryNext.InventoryLevelDTO | InventoryNext.InventoryLevelDTO[]
  > {
    const input = Array.isArray(updates) ? updates : [updates]

    const levels = await this.updateInventoryLevels_(input, context)

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
    const inventoryLevels = await this.ensureInventoryLevels(updates, context)

    const levelMap = inventoryLevels.reduce((acc, curr) => {
      const inventoryLevelMap = acc.get(curr.inventory_item_id) ?? new Map()
      inventoryLevelMap.set(curr.location_id, curr.id)
      acc.set(curr.inventory_item_id, inventoryLevelMap)
      return acc
    }, new Map())

    return await this.inventoryLevelService_.update(
      updates.map(async (update) => {
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

    return await this.baseRepository_.serialize<InventoryNext.ReservationItemDTO>(
      result,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async updateReservationItems_(
    input: (InventoryNext.UpdateReservationItemInput & { id: string })[],
    @MedusaContext() context: Context = {}
  ): Promise<TReservationItem[]> {
    return await this.reservationItemService_.update(input, context)
  }

  /**
   * Deletes reservation items by line item
   * @param lineItemId - the id of the line item associated with the reservation item
   * @param context
   */

  @InjectTransactionManager("baseRepository_")
  async deleteReservationItemsByLineItem(
    lineItemId: string | string[],
    @MedusaContext() context: Context = {}
  ): Promise<void> {
    return await this.reservationItemService_.deleteByLineItem(
      lineItemId,
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
  @InjectManager("baseRepository_")
  async adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    @MedusaContext() context: Context = {}
  ): Promise<InventoryNext.InventoryLevelDTO> {
    const result = await this.adjustInventory_(
      inventoryItemId,
      locationId,
      adjustment,
      context
    )

    return await this.baseRepository_.serialize<InventoryNext.InventoryLevelDTO>(
      result,
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
    const [inventoryLevel] = await this.inventoryLevelService_.list(
      { inventory_item_id: inventoryItemId, location_id: locationId },
      { take: 1 },
      context
    )
    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for inventory item ${inventoryItemId} and location ${locationId} not found`
      )
    }

    return await this.inventoryLevelService_.update(
      {
        id: inventoryLevel.id,
        stocked_quantity: inventoryLevel.stocked_quantity + adjustment,
      },
      context
    )
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

  // @InjectManager("baseRepository_")
  // async retrieveInventoryLevel(
  //   inventoryLevelId: string,
  //   config?: FindConfig<InventoryNext.InventoryNext.InventoryLevelDTO>,
  //   @MedusaContext() context: Context = {}
  // ): Promise<InventoryNext.InventoryLevelDTO> {
  //   return this.inventoryLevelService_.retrieve(
  //     inventoryLevelId,
  //     config,
  //     context
  //   )
  // }

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

    const stockedQuantity =
      await this.inventoryLevelService_.getStockedQuantity(
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
}
