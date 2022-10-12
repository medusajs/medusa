import { MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  IInventoryService,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  FilterableStockLocationProps,
  CreateStockLocationInput,
  UpdateStockLocationInput,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
  IEventBusService,
  InventoryItemDTO,
  InventoryLevelDTO,
  StockLocationDTO,
} from "@medusajs/medusa"

import { InventoryItem, InventoryLevel, StockLocation } from "../models"

import {
  InventoryItemService,
  InventoryLevelService,
  StockLocationService,
} from "./"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class InventoryService implements IInventoryService {
  protected readonly eventBusService: IEventBusService
  protected readonly inventoryItemService: InventoryItemService
  protected readonly inventoryLevelService: InventoryLevelService
  protected readonly stockLocationService: StockLocationService

  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService = eventBusService
    this.inventoryItemService = new InventoryItemService({ eventBusService })
    this.inventoryLevelService = new InventoryLevelService({ eventBusService })
    this.stockLocationService = new StockLocationService({ eventBusService })
  }

  async listLocations(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>
  ): Promise<[StockLocationDTO[], number]> {
    return this.stockLocationService.listAndCount(selector, config)
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

  async retrieveLocation(id: string): Promise<StockLocationDTO> {
    const locationResult = await this.stockLocationService.retrieve(id)
    return { ...locationResult }
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

  async createLocation(
    input: CreateStockLocationInput
  ): Promise<StockLocationDTO> {
    return await this.stockLocationService.create(input)
  }

  async createInventoryLevel(
    input: CreateInventoryLevelInput
  ): Promise<InventoryLevelDTO> {
    return await this.inventoryLevelService.create(input)
  }

  async updateLocation(
    id: string,
    input: UpdateStockLocationInput
  ): Promise<StockLocationDTO> {
    return await this.stockLocationService.update(id, input)
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

  async confirmInventory(
    itemId: string,
    locationIds: string[],
    quantity: number
  ): Promise<boolean> {
    // Throws if item does not exist
    await this.inventoryItemService.retrieve(itemId, {
      select: ["id"],
    })

    const locations = await this.stockLocationService.list(
      { id: locationIds },
      { select: ["id"] }
    )

    if (locations.length !== locationIds.length) {
      const missingLocationIds = locationIds.filter((id) => {
        return !locations.find((l) => l.id === id)
      })

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Query contains invalid Locations: [${missingLocationIds.join(", ")}]`
      )
    }

    const stockedQuantity = await this.inventoryLevelService.getStockedQuantity(
      itemId,
      locationIds
    )

    return stockedQuantity >= quantity
  }
}
