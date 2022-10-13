import { FindConfig } from "../../types/common"

import {
  InventoryItemDTO,
  ReservationItemDTO,
  InventoryLevelDTO,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  CreateReservationItemInput,
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

  retrieveInventoryItem(
    itemId: string,
    config?: FindConfig<InventoryItemDTO>
  ): Promise<InventoryItemDTO>

  retrieveInventoryLevel(
    itemId: string,
    locationId: string
  ): Promise<InventoryLevelDTO>

  createReservationItem(
    input: CreateReservationItemInput
  ): Promise<ReservationItemDTO>

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

  retrieveAvailableQuantity(
    itemId: string,
    locationIds: string[]
  ): Promise<number>

  retrieveStockedQuantity(
    itemId: string,
    locationIds: string[]
  ): Promise<number>
}
