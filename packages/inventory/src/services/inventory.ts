import { MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  IInventoryService,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  CreateReservationItemInput,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
  IEventBusService,
  InventoryItemDTO,
  ReservationItemDTO,
  InventoryLevelDTO,
} from "@medusajs/medusa"

import {
  InventoryItemService,
  ReservationItemService,
  InventoryLevelService,
} from "./"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class InventoryService implements IInventoryService {
  protected readonly eventBusService: IEventBusService
  protected readonly inventoryItemService: InventoryItemService
  protected readonly reservationItemService: ReservationItemService
  protected readonly inventoryLevelService: InventoryLevelService

  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService = eventBusService
    this.reservationItemService = new ReservationItemService({
      eventBusService,
    })
    this.inventoryItemService = new InventoryItemService({ eventBusService })
    this.inventoryLevelService = new InventoryLevelService({ eventBusService })
  }

  async listInventoryItems(
    selector: FilterableInventoryItemProps,
    config: FindConfig<InventoryItemDTO> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryItemDTO[], number]> {
    return await this.inventoryItemService.listAndCount(selector, config)
  }

  async listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config: FindConfig<InventoryLevelDTO> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryLevelDTO[], number]> {
    return await this.inventoryLevelService.listAndCount(selector, config)
  }

  async retrieveInventoryItem(
    itemId: string,
    config?: FindConfig<InventoryItemDTO>
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService.retrieve(
      itemId,
      config
    )
    return { ...inventoryItem }
  }

  async retrieveInventoryLevel(
    itemId: string,
    locationId: string
  ): Promise<InventoryLevelDTO> {
    const [inventoryLevel] = await this.inventoryLevelService.list(
      { item_id: itemId, location_id: locationId },
      { take: 1 }
    )
    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for item ${itemId} and location ${locationId} not found`
      )
    }
    return inventoryLevel
  }

  async createReservationItem(
    input: CreateReservationItemInput
  ): Promise<ReservationItemDTO> {
    // Verify that the item is stocked at the location
    const [inventoryLevel] = await this.inventoryLevelService.list(
      { item_id: input.item_id, location_id: input.location_id },
      { take: 1 }
    )

    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Item ${input.item_id} is not stocked at location ${input.location_id}`
      )
    }

    const reservationItem = await this.reservationItemService.create(input)

    return { ...reservationItem }
  }

  async createInventoryItem(
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService.create(input)
    return { ...inventoryItem }
  }

  async createInventoryLevel(
    input: CreateInventoryLevelInput
  ): Promise<InventoryLevelDTO> {
    return await this.inventoryLevelService.create(input)
  }

  async updateInventoryItem(
    itemId: string,
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService.update(itemId, input)
    return { ...inventoryItem }
  }

  async deleteInventoryItem(itemId: string): Promise<void> {
    return await this.inventoryItemService.delete(itemId)
  }

  async adjustInventory(
    itemId: string,
    locationId: string,
    adjustment: number
  ): Promise<InventoryLevelDTO> {
    const [inventoryLevel] = await this.inventoryLevelService.list(
      { item_id: itemId, location_id: locationId },
      { take: 1 }
    )
    if (!inventoryLevel) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory level for item ${itemId} and location ${locationId} not found`
      )
    }

    // TODO: Record adjustment

    const updatedInventoryLevel = await this.inventoryLevelService.update(
      inventoryLevel.id,
      {
        stocked_quantity: inventoryLevel.stocked_quantity + adjustment,
      }
    )

    return { ...updatedInventoryLevel }
  }

  async retrieveAvailableQuantity(
    itemId: string,
    locationIds: string[]
  ): Promise<number> {
    // Throws if item does not exist
    await this.inventoryItemService.retrieve(itemId, {
      select: ["id"],
    })

    const stockedQuantity = await this.inventoryLevelService.getStockedQuantity(
      itemId,
      locationIds
    )

    const reservedQuantity =
      await this.reservationItemService.getReservedQuantity(itemId, locationIds)

    return stockedQuantity - reservedQuantity
  }

  async retrieveStockedQuantity(
    itemId: string,
    locationIds: string[]
  ): Promise<number> {
    // Throws if item does not exist
    await this.inventoryItemService.retrieve(itemId, {
      select: ["id"],
    })

    const stockedQuantity = await this.inventoryLevelService.getStockedQuantity(
      itemId,
      locationIds
    )

    return stockedQuantity
  }

  async confirmInventory(
    itemId: string,
    locationIds: string[],
    quantity: number
  ): Promise<boolean> {
    const stockedQuantity = await this.retrieveAvailableQuantity(
      itemId,
      locationIds
    )
    return stockedQuantity >= quantity
  }
}
