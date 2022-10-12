import { FindConfig } from "../types/common"

import {
  InventoryItemDTO,
  InventoryLevelDTO,
  StockLocationDTO,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  FilterableStockLocationProps,
  CreateStockLocationInput,
  UpdateStockLocationInput,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
} from "../types/inventory"

export interface IInventoryService {
  listLocations(
    selector: FilterableStockLocationProps,
    config?: FindConfig<StockLocationDTO>
  ): Promise<[StockLocationDTO[], number]>

  listInventoryItems(
    selector: FilterableInventoryItemProps,
    config?: FindConfig<InventoryItemDTO>
  ): Promise<[InventoryItemDTO[], number]>

  retrieveLocation(id: string): Promise<StockLocationDTO>

  retrieveInventoryItem(itemId: string): Promise<InventoryItemDTO>

  retrieveInventoryLevel(
    itemId: string,
    locationId: string
  ): Promise<InventoryLevelDTO>

  createInventoryItem(
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO>

  createLocation(input: CreateStockLocationInput): Promise<StockLocationDTO>

  createInventoryLevel(
    data: CreateInventoryLevelInput
  ): Promise<InventoryLevelDTO>

  updateLocation(
    id: string,
    input: UpdateStockLocationInput
  ): Promise<StockLocationDTO>

  updateInventoryItem(
    itemId: string,
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO>

  deleteInventoryItem(itemId: string): Promise<void>

  adjustInventory(
    itemId: string,
    locationId: string,
    adjustment: number
  ): Promise<InventoryLevelDTO>

  confirmInventory(
    itemId: string,
    locationIds: string[],
    quantity: number
  ): Promise<boolean>
}
