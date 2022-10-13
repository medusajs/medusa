import { MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  IInventoryService,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
  IEventBusService,
  IStockLocationService,
  InventoryItemDTO,
  InventoryLevelDTO,
} from "@medusajs/medusa"

import { InventoryItemService, InventoryLevelService } from "./"

type InjectedDependencies = {
  stockLocationService: IStockLocationService
  eventBusService: IEventBusService
}

export default class InventoryService implements IInventoryService {
  protected readonly eventBusService: IEventBusService
  protected readonly inventoryItemService: InventoryItemService
  protected readonly inventoryLevelService: InventoryLevelService
  protected readonly stockLocationService: IStockLocationService

  constructor({ eventBusService, stockLocationService }: InjectedDependencies) {
    this.eventBusService = eventBusService
    this.stockLocationService = stockLocationService
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

  async retrieveInventoryItem(itemId: string): Promise<InventoryItemDTO> {
    const inventoryItem = await this.inventoryItemService.retrieve(itemId)
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

  async retrieveQuantity(
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
    const stockedQuantity = await this.retrieveQuantity(itemId, locationIds)
    return stockedQuantity >= quantity
  }
}
