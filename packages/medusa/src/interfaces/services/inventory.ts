import { EntityManager } from "typeorm"
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
  withTransaction(transactionManager?: EntityManager): this

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
    inventoryItemId: string,
    config?: FindConfig<InventoryItemDTO>
  ): Promise<InventoryItemDTO>

  retrieveInventoryLevel(
    inventoryItemId: string,
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
    inventoryItemId: string,
    locationId: string,
    update: UpdateInventoryLevelInput
  ): Promise<InventoryLevelDTO>

  updateInventoryItem(
    inventoryItemId: string,
    input: CreateInventoryItemInput
  ): Promise<InventoryItemDTO>

  updateReservationItem(
    reservationItemId: string,
    input: UpdateReservationItemInput
  ): Promise<ReservationItemDTO>

  deleteReservationItemsByLineItem(lineItemId: string): Promise<void>

  deleteReservationItem(reservationItemId: string): Promise<void>

  deleteInventoryItem(inventoryItemId: string): Promise<void>

  deleteInventoryLevel(
    inventoryLevelId: string,
    locationId: string
  ): Promise<void>

  adjustInventory(
    inventoryItemId: string,
    locationId: string,
    adjustment: number
  ): Promise<InventoryLevelDTO>

  confirmInventory(
    inventoryItemId: string,
    locationIds: string[],
    quantity: number
  ): Promise<boolean>

  retrieveAvailableQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number>

  retrieveStockedQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number>

  retrieveReservedQuantity(
    inventoryItemId: string,
    locationIds: string[]
  ): Promise<number>
}
