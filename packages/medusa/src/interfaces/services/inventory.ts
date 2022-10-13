import { FindConfig } from "../../types/common"

import {
  InventoryItemDTO,
  InventoryLevelDTO,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  FilterableInventoryLevelProps,
  CreateInventoryLevelInput,
} from "../../types/inventory"

export interface IInventoryService {
  listInventoryItems(
    selector: FilterableInventoryItemProps,
    config?: FindConfig<InventoryItemDTO>
  ): Promise<[InventoryItemDTO[], number]>

  listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config?: FindConfig<InventoryLevelDTO>
  ): Promise<[InventoryLevelDTO[], number]>

  retrieveInventoryItem(itemId: string): Promise<InventoryItemDTO>

  retrieveInventoryLevel(
    itemId: string,
    locationId: string
  ): Promise<InventoryLevelDTO>

  createInventoryItem(
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO>

  createInventoryLevel(
    data: CreateInventoryLevelInput
  ): Promise<InventoryLevelDTO>

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

  retrieveQuantity(itemId: string, locationIds: string[]): Promise<number>
}
