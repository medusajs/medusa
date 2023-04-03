import {
  CreateInventoryItemInput,
  CreateInventoryLevelInput,
  CreateReservationItemInput,
  FilterableInventoryItemProps,
  FilterableInventoryLevelProps,
  FilterableReservationItemProps,
  InventoryItemDTO,
  InventoryLevelDTO,
  ReservationItemDTO,
  UpdateInventoryLevelInput,
  UpdateReservationItemInput,
} from "./common"

import { FindConfig } from "../common"
import { SharedContext } from ".."

export interface IInventoryService {
  listInventoryItems(
    selector: FilterableInventoryItemProps,
    config?: FindConfig<InventoryItemDTO>,
    context?: SharedContext
  ): Promise<[InventoryItemDTO[], number]>

  listReservationItems(
    selector: FilterableReservationItemProps,
    config?: FindConfig<ReservationItemDTO>,
    context?: SharedContext
  ): Promise<[ReservationItemDTO[], number]>

  listInventoryLevels(
    selector: FilterableInventoryLevelProps,
    config?: FindConfig<InventoryLevelDTO>,
    context?: SharedContext
  ): Promise<[InventoryLevelDTO[], number]>

  retrieveInventoryItem(
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>,
    context?: SharedContext
  ): Promise<InventoryItemDTO>

  retrieveInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    context?: SharedContext
  ): Promise<InventoryLevelDTO>

  retrieveReservationItem(
    reservationId: string,
    context?: SharedContext
  ): Promise<ReservationItemDTO>

  createReservationItem(
    input: CreateReservationItemInput,
    context?: SharedContext
  ): Promise<ReservationItemDTO>

  createInventoryItem(
    input: CreateInventoryItemInput,
    context?: SharedContext
  ): Promise<InventoryItemDTO>

  createInventoryLevel(
    data: CreateInventoryLevelInput,
    context?: SharedContext
  ): Promise<InventoryLevelDTO>

  updateInventoryLevel(
    inventoryItemId: string,
    locationId: string,
    update: UpdateInventoryLevelInput,
    context?: SharedContext
  ): Promise<InventoryLevelDTO>

  updateInventoryItem(
    inventoryItemId: string,
    input: CreateInventoryItemInput,
    context?: SharedContext
  ): Promise<InventoryItemDTO>

  updateReservationItem(
    reservationItemId: string,
    input: UpdateReservationItemInput,
    context?: SharedContext
  ): Promise<ReservationItemDTO>

  deleteReservationItemsByLineItem(
    lineItemId: string,
    context?: SharedContext
  ): Promise<void>

  deleteReservationItem(
    reservationItemId: string | string[],
    context?: SharedContext
  ): Promise<void>

  deleteInventoryItem(
    inventoryItemId: string,
    context?: SharedContext
  ): Promise<void>

  deleteInventoryItemLevelByLocationId(
    locationId: string,
    context?: SharedContext
  ): Promise<void>

  deleteReservationItemByLocationId(
    locationId: string,
    context?: SharedContext
  ): Promise<void>

  deleteInventoryLevel(
    inventoryLevelId: string,
    locationId: string,
    context?: SharedContext
  ): Promise<void>

  adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number,
    context?: SharedContext
  ): Promise<InventoryLevelDTO>

  confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number,
    context?: SharedContext
  ): Promise<boolean>

  retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number>

  retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number>

  retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[],
    context?: SharedContext
  ): Promise<number>
}
