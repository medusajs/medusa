import { FindConfig } from "../../types/common"

import {
  InventoryItemDTO,
  ReservationItemDTO,
  InventoryLevelDTO,
  FilterableInventoryItemProps,
  CreateInventoryItemInput,
  CreateReservationItemInput,
  FilterableInventoryLevelProps,
  FilterableReservationItemProps,
  CreateInventoryLevelInput,
  UpdateInventoryLevelInput,
  UpdateReservationItemInput,
} from "../../types/inventory"

export interface IInventoryService {
  listInventoryItems(
    selector: FilterableInventoryItemProps,
    config?: FindConfig<InventoryItemDTO>
  ): Promise<[InventoryItemDTO[], number]>

  listReservationItems(
    selector: FilterableReservationItemProps,
    config?: FindConfig<ReservationItemDTO>
  ): Promise<[ReservationItemDTO[], number]>

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

  updateInventoryLevel(
    itemId: string,
    locationId: string,
    update: UpdateInventoryLevelInput
  ): Promise<InventoryLevelDTO>

  updateInventoryItem(
    itemId: string,
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO>

  updateReservationItem(
    reservationId: string,
    update: UpdateReservationItemInput
  ): Promise<ReservationItemDTO>

  deleteReservationItemsByLineItem(lineItemId: string): Promise<void>

  deleteReservationItem(id: string): Promise<void>

  deleteInventoryItem(itemId: string): Promise<void>

  deleteInventoryLevel(itemId: string, locationId: string): Promise<void>

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
