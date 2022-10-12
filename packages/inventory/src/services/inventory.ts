import { MedusaError } from "medusa-core-utils"
import {
  FindConfig,
  IInventoryService,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  FilterableLocationProps,
  CreateLocationInput,
  UpdateLocationInput,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
  IEventBusService,
  InventoryItemDTO,
  InventoryLevelDTO,
  StockLocationDTO,
} from "@medusajs/medusa"

import { InventoryItem, InventoryLevel, Location } from "../models"

import {
  InventoryItemService,
  InventoryLevelService,
  LocationService,
} from "./"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class InventoryService implements IInventoryService {
  protected readonly eventBusService: IEventBusService
  protected readonly inventoryItemService: InventoryItemService
  protected readonly inventoryLevelService: InventoryLevelService
  protected readonly locationService: LocationService

  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService = eventBusService
    this.inventoryItemService = new InventoryItemService({ eventBusService })
    this.inventoryLevelService = new InventoryLevelService({ eventBusService })
    this.locationService = new LocationService({ eventBusService })
  }

  async listLocations(
    selector: FilterableLocationProps,
    config?: FindConfig<StockLocationDTO>
  ): Promise<[StockLocationDTO[], number]> {
    return this.locationService.listAndCount(selector, config)
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
    const locationResult = await this.locationService.retrieve(id)
    return { ...locationResult }
  }

  async retrieveInventoryItem(itemId: string): Promise<InventoryItemDTO> {
    return await this.inventoryItemService.retrieve(itemId)
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
    return await this.inventoryItemService.create(input)
  }

  async createLocation(input: CreateLocationInput): Promise<StockLocationDTO> {
    return await this.locationService.create(input)
  }

  async createInventoryLevel(
    input: CreateInventoryLevelInput
  ): Promise<InventoryLevelDTO> {
    return await this.inventoryLevelService.create(input)
  }

  async updateLocation(
    id: string,
    input: UpdateLocationInput
  ): Promise<StockLocationDTO> {
    return await this.locationService.update(id, input)
  }

  async updateInventoryItem(
    itemId: string,
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO> {
    return await this.inventoryItemService.update(itemId, input)
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

    return await this.inventoryLevelService.update(inventoryLevel.id, {
      stocked_quantity: inventoryLevel.stocked_quantity + adjustment,
    })
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

    const locations = await this.locationService.list(
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
