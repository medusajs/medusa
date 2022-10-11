import { getConnection, EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { FindConfig, IInventoryService, buildQuery } from "@medusajs/medusa"

import { InventoryItem, InventoryLevel, Location } from "../models"
import {
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  FilterableLocationProps,
  CreateLocationInput,
  UpdateLocationInput,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
  IEventBusService,
} from "../types"

import {
  InventoryItemService,
  InventoryLevelService,
  LocationService,
} from "./"

type InjectedDependencies = {
  eventBusService: IEventBusService
}

export default class InventoryService {
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
    config?: FindConfig<Location>
  ): Promise<[Location[], number]> {
    return this.locationService.listAndCount(selector, config)
  }

  async listInventoryItems(
    selector: FilterableInventoryItemProps,
    config: FindConfig<InventoryItem> = { relations: [], skip: 0, take: 10 }
  ): Promise<[InventoryItem[], number]> {
    return await this.inventoryItemService.listAndCount(selector, config)
  }

  async retrieveLocation(id: string): Promise<Location> {
    return await this.locationService.retrieve(id)
  }

  async retrieveInventoryItem(itemId: string): Promise<InventoryItem> {
    return await this.inventoryItemService.retrieve(itemId)
  }

  async createInventoryItem(
    input: CreateInventoryItemInput
  ): Promise<InventoryItem> {
    return await this.inventoryItemService.create(input)
  }

  async createLocation(input: CreateLocationInput): Promise<Location> {
    return await this.locationService.create(input)
  }

  async updateLocation(
    id: string,
    input: UpdateLocationInput
  ): Promise<Location> {
    return await this.locationService.update(id, input)
  }

  async updateInventoryItem(
    itemId: string,
    input: CreateInventoryItemInput
  ): Promise<InventoryItem> {
    return await this.inventoryItemService.update(itemId, input)
  }

  async deleteInventoryItem(itemId: string): Promise<void> {
    return await this.inventoryItemService.delete(itemId)
  }

  async retrieveInventoryLevel(
    itemId: string,
    locationId: string
  ): Promise<InventoryLevel> {
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

  async adjustInventory(
    itemId: string,
    locationId: string,
    adjustment: number
  ): Promise<InventoryLevel> {
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
